from __future__ import annotations

import logging
import os
from typing import Any

from getstream.models import MemberRequest
from vision_agents.core import Agent, AgentLauncher, Runner, User
from vision_agents.core.edge.events import (
    ParticipantJoinedEvent,
    TrackAddedEvent,
    TrackRemovedEvent,
)
from vision_agents.core.instructions import Instructions
from vision_agents.plugins import gemini, getstream

from env import load_env, require_env
from teacher import build_opening_prompt, build_teacher_instructions

logger = logging.getLogger(__name__)

AGENT_USER = User(name="Language Teacher", id="language-teacher")
SEND_AUDIO = "send-audio"

# Use gemini-3.1-flash-live-preview for bidirectional audio conversation (Live API)
DEFAULT_GEMINI_REALTIME_MODEL = "gemini-3.1-flash-live-preview"


def _extract_custom_data(**kwargs: Any) -> dict[str, Any]:
    for key in ("custom_data", "custom", "call_custom"):
        value = kwargs.get(key)
        if isinstance(value, dict):
            return value
    return {}


async def _fetch_call_custom_data(agent: Agent, call_type: str, call_id: str) -> dict[str, Any]:
    call = agent.edge.client.video.call(call_type, call_id)
    response = await call.get()
    custom = response.data.call.custom
    if isinstance(custom, dict):
        return custom
    return {}


def _grant_learner_send_audio_sync(
    granted_user_ids: set[str],
    user_id: str | None,
) -> bool:
    if not user_id or user_id == AGENT_USER.id or user_id in granted_user_ids:
        return False
    granted_user_ids.add(user_id)
    return True


async def _grant_learner_send_audio(
    call: Any,
    user_id: str | None,
    granted_user_ids: set[str],
) -> None:
    if not _grant_learner_send_audio_sync(granted_user_ids, user_id):
        return

    try:
        await call.update_user_permissions(
            user_id=user_id,
            grant_permissions=[SEND_AUDIO],
        )
        logger.info("Granted send-audio to learner %s", user_id)
    except Exception:
        granted_user_ids.discard(user_id or "")
        logger.exception("Failed to grant send-audio to learner %s", user_id)


async def _grant_existing_learners(call: Any, granted_user_ids: set[str]) -> None:
    response = await call.get()
    members = response.data.members or []
    for member in members:
        user_id = getattr(member, "user_id", None)
        if isinstance(user_id, str):
            await _grant_learner_send_audio(call, user_id, granted_user_ids)


async def _prepare_audio_room(agent: Agent, call_type: str, call_id: str) -> Any:
    await agent.authenticate()
    call = agent.edge.client.video.call(call_type, call_id)
    await call.get()
    await call.update_call_members(
        update_members=[MemberRequest(user_id=AGENT_USER.id, role="admin")]
    )
    await call.go_live()

    try:
        await call.start_closed_captions(language="en")
        logger.info("Started closed captions for call %s", call_id)
    except Exception:
        logger.exception("Failed to start closed captions for call %s", call_id)

    return call


def _gemini_realtime_model() -> str:
    return os.getenv("GEMINI_REALTIME_MODEL", DEFAULT_GEMINI_REALTIME_MODEL)


async def create_agent(**kwargs: Any) -> Agent:
    custom_data = _extract_custom_data(**kwargs)
    instructions = build_teacher_instructions(custom_data=custom_data)
    model = _gemini_realtime_model()
    logger.info("Using Gemini Realtime model: %s", model)

    # Configure Gemini Realtime with VAD settings for better speech detection
    from google.genai.types import (
        AutomaticActivityDetectionDict,
        EndSensitivity,
        RealtimeInputConfigDict,
        StartSensitivity,
    )

    llm = gemini.Realtime(
        model=model,
        config={
            "realtime_input_config": RealtimeInputConfigDict(
                automatic_activity_detection=AutomaticActivityDetectionDict(
                    start_of_speech_sensitivity=StartSensitivity.START_SENSITIVITY_HIGH,
                    end_of_speech_sensitivity=EndSensitivity.END_SENSITIVITY_HIGH,
                    silence_duration_ms=500,  # Increased from 250ms to allow for pauses
                    prefix_padding_ms=100,    # Increased from 50ms to capture speech start
                ),
            ),
        },
    )

    return Agent(
        edge=getstream.Edge(),
        agent_user=AGENT_USER,
        instructions=instructions,
        llm=llm,
    )


async def join_call(
    agent: Agent,
    call_type: str,
    call_id: str,
    **kwargs: Any,
) -> None:
    custom_data = await _fetch_call_custom_data(agent, call_type, call_id)
    agent.instructions = Instructions(
        input_text=build_teacher_instructions(custom_data=custom_data)
    )

    call = await _prepare_audio_room(agent, call_type, call_id)
    granted_user_ids: set[str] = set()
    # Grant once after go_live so learners can publish in the live audio room.
    await _grant_existing_learners(call, granted_user_ids)

    @agent.events.subscribe
    async def grant_learner_audio_on_join(event: ParticipantJoinedEvent) -> None:
        logger.info("Participant joined: %s", event.participant.user_id)
        await _grant_learner_send_audio(
            call,
            event.participant.user_id,
            granted_user_ids,
        )

    # Track when audio tracks are added (learner starts publishing audio)
    @agent.events.subscribe
    async def on_track_added(event: TrackAddedEvent) -> None:
        logger.info("=== TRACK ADDED ===")
        logger.info("  Track type: %s", getattr(event, 'track_type', 'unknown'))
        logger.info("  Participant: %s", getattr(event.participant, 'user_id', 'unknown'))
        logger.info("  Track ID: %s", getattr(event, 'track_id', 'unknown'))
        if hasattr(event, 'participant') and hasattr(event.participant, 'name'):
            logger.info("  Participant name: %s", event.participant.name)

    # Track when audio tracks are removed
    @agent.events.subscribe
    async def on_track_removed(event: TrackRemovedEvent) -> None:
        logger.info("=== TRACK REMOVED ===")
        logger.info("  Track type: %s", getattr(event, 'track_type', 'unknown'))
        logger.info("  Participant: %s", getattr(event.participant, 'user_id', 'unknown'))

    # Log when agent receives audio from participants
    @agent.events.subscribe
    async def log_audio_events(event: Any) -> None:
        event_type = type(event).__name__
        # Log all audio-related events
        if 'audio' in event_type.lower():
            logger.info("Audio event: %s", event_type)
            if hasattr(event, 'participant'):
                logger.info("  From participant: %s", getattr(event.participant, 'user_id', 'unknown'))
            if hasattr(event, 'track'):
                logger.info("  Track: %s", getattr(event, 'track', 'none'))
        # Log transcript events
        if 'transcript' in event_type.lower():
            logger.info("Transcript event: %s", event_type)
            if hasattr(event, 'text'):
                logger.info("  Text: %s", event.text[:100] if len(event.text) > 100 else event.text)
        # Log user turn events
        if 'user' in event_type.lower() and 'turn' in event_type.lower():
            logger.info("User turn event: %s", event_type)
            if hasattr(event, 'participant'):
                logger.info("  Participant: %s", getattr(event.participant, 'user_id', 'unknown'))

    # Diagnostic: confirm Gemini is actually processing the learner's audio.
    # If you see "=== USER TURN DETECTED ===" when you speak, the audio pipeline
    # is working and the issue is in Gemini's response generation.
    @agent.events.subscribe
    async def log_user_turn_events(event: Any) -> None:
        event_type = type(event).__name__
        if "UserTurn" in event_type or "UserSpeech" in event_type:
            logger.info("=== USER TURN DETECTED ===")
            logger.info("  Event: %s", event_type)
            if hasattr(event, "text"):
                logger.info("  Text: %s", event.text)
            if hasattr(event, "participant"):
                logger.info(
                    "  Participant: %s",
                    getattr(event.participant, "user_id", "unknown"),
                )

    async with agent.join(call, participant_wait_timeout=30.0):
        # Wait for the learner to actually join before speaking.
        # Without this, simple_response fires immediately and Gemini's audio
        # input pipeline initializes with zero audio tracks to listen to.
        logger.info("Waiting for learner to join the call...")
        await agent.wait_for_participant(timeout=60.0)
        logger.info("Learner joined! Starting conversation.")

        opening = build_opening_prompt(custom_data=custom_data)
        logger.info("Starting conversation with opening prompt")
        await agent.simple_response(opening)
        logger.info("Opening prompt completed, agent is now listening continuously")
        
        # Keep the agent alive and listening for the entire call duration
        # agent.finish() will wait until the call ends
        await agent.finish()
        logger.info("Call ended")


def main() -> None:
    load_env()
    require_env("STREAM_API_KEY")
    require_env("STREAM_API_SECRET")
    require_env("GOOGLE_API_KEY")

    launcher = AgentLauncher(
        create_agent=create_agent,
        join_call=join_call,
    )
    Runner(launcher=launcher).cli()


if __name__ == "__main__":
    main()
