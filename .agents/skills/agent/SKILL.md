---
name: Agent
description: Use when building real-time voice and video AI agents, deploying conversational interfaces, integrating with LLMs and speech services, handling function calling and tool use, or scaling agents to production with Docker and Kubernetes.
metadata:
    mintlify-proj: agent
    version: "1.0"
---

# Vision Agents Skill

## Product summary

Vision Agents is a Python framework for building real-time voice and video AI agents. It orchestrates LLMs, speech-to-text, text-to-speech, video processors, and external tools into conversational agents that run on Stream's edge network or your own infrastructure. Key files: `main.py` (agent definition), `.env` (API keys), `pyproject.toml` (dependencies). Core classes: `Agent` (orchestrator), `Runner` (CLI/HTTP server), `AgentLauncher` (session management). CLI: `uv run agent.py run` (console mode), `uv run agent.py serve` (HTTP server). Primary docs: https://visionagents.ai

## When to use

Reach for this skill when:
- Building voice agents that listen, understand, and respond naturally
- Creating video agents that analyze camera feeds with computer vision or VLMs
- Integrating function calling and external tools into agent conversations
- Deploying agents to production with Docker, Kubernetes, or horizontal scaling
- Testing agent behavior with pytest before live deployment
- Handling real-time interruptions and turn detection in conversations
- Swapping AI providers (LLM, STT, TTS, vision models) without rewriting agent logic
- Setting up HTTP servers that spawn agents on demand with session management
- Monitoring agent performance with OpenTelemetry metrics

## Quick reference

### Agent initialization patterns

| Pattern | Use case | Code |
|---------|----------|------|
| **Realtime LLM** | Fastest, lowest latency, built-in STT/TTS | `llm=gemini.Realtime()` or `openai.Realtime()` |
| **Custom pipeline** | Full control over STT, LLM, TTS | `llm=gemini.LLM()`, `stt=deepgram.STT()`, `tts=elevenlabs.TTS()` |
| **Video realtime** | Stream video directly to model | `llm=gemini.Realtime(fps=3)` |
| **VLM + STT/TTS** | Video understanding with voice | `llm=nvidia.VLM(fps=1)`, `stt=deepgram.STT()`, `tts=elevenlabs.TTS()` |
| **With processors** | Computer vision + LLM | `processors=[ultralytics.YOLOPoseProcessor(...)]` |

### Core Agent methods

| Method | Purpose |
|--------|---------|
| `async join(call)` | Join a call as async context manager |
| `await simple_response(text, interrupt=True)` | Send prompt to LLM, speak response |
| `await say(text, interrupt=False)` | Speak text directly, bypass LLM |
| `await finish()` | Wait for call to end gracefully |
| `@agent.events.subscribe` | Subscribe to events (participants, transcripts, LLM responses) |
| `@llm.register_function()` | Register tool for function calling |

### Running agents

| Command | Mode | Use |
|---------|------|-----|
| `uv run agent.py run` | Console | Development, testing, single agent |
| `uv run agent.py serve` | HTTP server | Production, on-demand agent spawning |
| `--video-track-override=/path/to/video.mp4` | Video override | Test video processing without camera |

### HTTP server endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/calls/{call_id}/sessions` | Spawn agent for a call |
| DELETE | `/calls/{call_id}/sessions/{session_id}` | Close agent session |
| GET | `/calls/{call_id}/sessions/{session_id}` | Get session info |
| GET | `/calls/{call_id}/sessions/{session_id}/metrics` | Real-time performance metrics |
| GET | `/health` | Liveness check |
| GET | `/ready` | Readiness check |

### Common events to subscribe to

| Event | Import | When |
|-------|--------|------|
| `ParticipantJoinedEvent` | `vision_agents.core.edge.events` | User joins call |
| `UserTranscriptEvent` | `vision_agents.core.agents.events` | User speech transcribed |
| `LLMResponseFinalEvent` | `vision_agents.core.llm.events` | LLM finishes response |
| `ToolStartEvent` / `ToolEndEvent` | `vision_agents.core.llm.events` | Function call executed |

### Provider categories

| Category | Examples | When |
|----------|----------|------|
| **Realtime** | Gemini, OpenAI, Qwen, xAI | Lowest latency, native audio/video |
| **LLM** | OpenAI, Gemini, Anthropic, OpenRouter | Custom STT/TTS pipelines |
| **STT** | Deepgram, ElevenLabs, Fast-Whisper, Fish | Speech-to-text transcription |
| **TTS** | ElevenLabs, Cartesia, Deepgram, Kokoro | Voice synthesis |
| **Vision** | YOLO, Roboflow, NVIDIA, Moondream | Object detection, VLMs |
| **Turn Detection** | Smart Turn, Vogent | Interruption handling (if STT lacks built-in) |

## Decision guidance

### Realtime vs Custom Pipeline

| Aspect | Realtime LLM | Custom Pipeline |
|--------|--------------|-----------------|
| **Latency** | Lowest (~100ms) | Higher (~300-500ms) |
| **Setup** | Simplest (1 plugin) | More config (3+ plugins) |
| **Control** | Limited to model's STT/TTS | Full control over each component |
| **Cost** | Model-dependent | Pay per component |
| **Interruption** | Built-in at model level | Requires turn detection plugin |
| **Use when** | Speed critical, simple agents | Need specific providers or tools |

### Video processing: Realtime vs VLM vs Processors

| Aspect | Realtime | VLM | Processors |
|--------|----------|-----|-----------|
| **Latency** | Lowest | Medium | Depends on model |
| **Video understanding** | Native | Excellent | Limited to detection |
| **Flexibility** | Model-limited | High | Custom ML pipelines |
| **Cost** | Per-token | Per-request | Compute-based |
| **Use when** | Real-time video chat | Analyze frames, answer questions | Detect objects, pose, segmentation |

### Deployment: Console vs HTTP vs Kubernetes

| Aspect | Console | HTTP Server | Kubernetes |
|--------|---------|-------------|-----------|
| **Agents** | Single | Multiple (on-demand) | Scaled across nodes |
| **Sessions** | In-memory | In-memory or Redis | Redis-backed registry |
| **Scaling** | None | Single node | Horizontal across nodes |
| **Monitoring** | Logs only | Metrics endpoint | Prometheus + Grafana |
| **Use when** | Development | Single server production | High-traffic, multi-region |

## Workflow

### 1. Build a voice agent

1. **Initialize project**: `uv init --python 3.12 my-agent && cd my-agent && uv add "vision-agents[getstream,gemini]" python-dotenv`
2. **Get API keys**: Stream (getstream.io), Google (aistudio.google.com), and any STT/TTS providers
3. **Create `.env`**: Add `STREAM_API_KEY`, `STREAM_API_SECRET`, `GOOGLE_API_KEY`
4. **Write `main.py`**:
   - Define `async create_agent(**kwargs) -> Agent` factory function
   - Define `async join_call(agent, call_type, call_id, **kwargs)` entry point
   - Create `Runner(AgentLauncher(create_agent=..., join_call=...))` and call `.cli()`
5. **Run locally**: `uv run main.py run` — opens browser link to test
6. **Test with tools**: Register functions with `@llm.register_function()`
7. **Deploy**: `uv run main.py serve` for HTTP server, then Docker/Kubernetes

### 2. Add function calling

1. **Register function on LLM**:
   ```python
   @llm.register_function(description="Get weather for a location")
   async def get_weather(location: str) -> dict:
       return {"temp": "22C", "condition": "Sunny"}
   ```
2. **Test with TestSession**:
   ```python
   async with TestSession(llm=llm, instructions="...") as session:
       response = await session.simple_response("Weather in London?")
       response.assert_function_called("get_weather", arguments={"location": "London"})
   ```
3. **Monitor execution**: Subscribe to `ToolStartEvent` and `ToolEndEvent`

### 3. Handle interruptions

1. **For realtime LLMs**: No setup needed — interruption is built-in
2. **For custom pipelines**:
   - If STT has built-in turn detection (Deepgram, ElevenLabs): Just use it
   - Otherwise, add `turn_detection=smart_turn.TurnDetection()` to Agent
3. **Tune sensitivity**: Adjust `buffer_in_seconds` and `confidence_threshold`
4. **Test**: Call `await agent.simple_response(..., interrupt=True)` to verify interruption works

### 4. Deploy to production

1. **Local HTTP server**: `uv run agent.py serve --host 0.0.0.0 --port 8000`
2. **Containerize**: Create Dockerfile with `FROM python:3.12`, install uv, copy code, expose port 8000
3. **Single node**: Push image to registry, run container with env vars
4. **Multiple nodes**: Add Redis for session registry, configure `SessionRegistry` in `AgentLauncher`
5. **Kubernetes**: Use Helm chart from Deploy example, add Prometheus scraping, Grafana dashboard
6. **Monitor**: Enable telemetry with OpenTelemetry, query metrics endpoint `/calls/{call_id}/sessions/{session_id}/metrics`

### 5. Test agent behavior

1. **Setup pytest**: Add `asyncio_mode = auto` to `pytest.ini`
2. **Create test**:
   ```python
   async def test_greeting():
       llm = gemini.LLM()
       async with TestSession(llm=llm, instructions="Be friendly") as session:
           response = await session.simple_response("Hello")
           assert response.function_calls == []
   ```
3. **Assert tool calls**: `response.assert_function_called("tool_name", arguments={...})`
4. **Judge responses**: Use `LLMJudge` to evaluate intent: `await judge.evaluate(response.chat_messages[0], intent="...")`
5. **Mock tools**: `with session.mock_functions({"tool": fake_impl}) as mocked: ...`

## Common gotchas

- **Async functions only**: `@llm.register_function()` requires async functions; sync functions raise `ValueError`
- **Event handlers are fire-and-forget**: Handlers run concurrently with no ordering guarantee; don't rely on one handler's state in another
- **Realtime LLMs don't need STT/TTS**: Providing both realtime LLM and separate STT/TTS causes conflicts; use one or the other
- **Turn detection conflicts**: If STT has built-in turn detection (Deepgram, ElevenLabs), don't add a separate `turn_detection` plugin — Agent auto-ignores it
- **Session limits matter**: Set `max_concurrent_sessions`, `max_sessions_per_call`, and `agent_idle_timeout` to prevent resource exhaustion
- **Close operations are async**: DELETE and POST `/close` return HTTP 202 Accepted; session closes on next maintenance cycle, not immediately
- **Environment variables auto-load**: Vision Agents loads `.env` automatically for each plugin; no manual `load_dotenv()` needed in plugins
- **Video override loops**: `--video-track-override` plays video in a loop at 30 FPS; useful for testing but not production
- **Metrics endpoint requires active session**: `/metrics` only works while session is running; closed sessions have no metrics
- **MCP servers need timeout**: Remote MCP servers should have `timeout` and `session_timeout` set to prevent hanging

## Verification checklist

Before submitting agent code:

- [ ] All required API keys are in `.env` (STREAM_API_KEY, STREAM_API_SECRET, provider keys)
- [ ] `create_agent()` is async and returns an `Agent` instance
- [ ] `join_call()` is async and calls `agent.join(call)` as context manager
- [ ] `Runner(AgentLauncher(...)).cli()` is called in `if __name__ == "__main__"`
- [ ] Agent runs locally with `uv run main.py run` without errors
- [ ] Browser link opens and agent responds to voice input
- [ ] All registered functions are async (no sync functions)
- [ ] Function descriptions are clear and specific
- [ ] Interruption handling works (agent stops mid-response when user speaks)
- [ ] Tests pass: `uv run pytest tests/ -m integration`
- [ ] HTTP server starts: `uv run main.py serve --host 0.0.0.0 --port 8000`
- [ ] Session creation works: `curl -X POST http://localhost:8000/calls/test/sessions`
- [ ] Metrics endpoint responds: `curl http://localhost:8000/calls/test/sessions/{session_id}/metrics`
- [ ] Docker image builds and runs with env vars
- [ ] No hardcoded API keys in code (use `.env` or environment variables)

## Resources

**Comprehensive navigation**: https://visionagents.ai/llms.txt — page-by-page reference for all documentation

**Critical docs**:
- [Quickstart](/introduction/quickstart) — 5-minute setup for first agent
- [Voice Agents](/introduction/voice-agents) — STT/LLM/TTS pipelines and function calling
- [Built-in HTTP Server](/guides/http-server) — Session management, CORS, authentication, scaling

---

> For additional documentation and navigation, see: https://visionagents.ai/llms.txt