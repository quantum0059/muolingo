from __future__ import annotations

from typing import Any

LANGUAGE_NAMES: dict[str, str] = {
    "es": "Spanish",
    "fr": "French",
    "ja": "Japanese",
    "ko": "Korean",
    "de": "German",
    "zh": "Chinese",
}

DEFAULT_INSTRUCTIONS = """You are a warm, energetic language teacher leading a voice-only audio lesson.

Personality:
- Sound human, friendly, and encouraging — like a real teacher cheering on a student.
- Use natural English with contractions (you're, let's, that's).
- Keep every reply to one or two short, conversational sentences.

Teaching style:
- Teach only the target language for this lesson — never switch languages or drift to unrelated topics.
- Stay strictly within this lesson's goals, vocabulary, phrases, and context.
- Speak mostly in English. When you introduce a target-language word or phrase, say it slowly once, then give the English translation.
- **IMPORTANT: After saying a phrase, pause and wait for the learner to respond. Listen carefully to what they say.**
- If the learner speaks, acknowledge what they said and respond naturally.
- Ask them to repeat phrases or gently invite them to try again when needed.
- Celebrate small wins briefly; correct mistakes gently without being harsh.
- **Never speak over the learner. Always give them time to respond after you ask a question or introduce a phrase.**
"""


def _pick_str(data: dict[str, Any], *keys: str) -> str | None:
    for key in keys:
        value = data.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    return None


def _pick_list(data: dict[str, Any], *keys: str) -> list[Any]:
    for key in keys:
        value = data.get(key)
        if isinstance(value, list):
            return value
    return []


def _pick_dict(data: dict[str, Any], *keys: str) -> dict[str, Any]:
    for key in keys:
        value = data.get(key)
        if isinstance(value, dict):
            return value
    return {}


def _format_goals(goals: list[Any]) -> str:
    lines: list[str] = []
    for goal in goals:
        if not isinstance(goal, dict):
            continue
        description = goal.get("description")
        if isinstance(description, str) and description.strip():
            lines.append(f"- {description.strip()}")
    return "\n".join(lines)


def _format_vocabulary(items: list[Any]) -> str:
    lines: list[str] = []
    for item in items:
        if not isinstance(item, dict):
            continue
        word = _pick_str(item, "word")
        translation = _pick_str(item, "translation")
        if not word or not translation:
            continue
        pronunciation = _pick_str(item, "pronunciation")
        example = _pick_str(item, "example")
        line = f"- {word} = {translation}"
        if pronunciation:
            line += f" ({pronunciation})"
        if example:
            line += f' — example: "{example}"'
        lines.append(line)
    return "\n".join(lines)


def _format_phrases(phrases: list[Any]) -> str:
    lines: list[str] = []
    for phrase in phrases:
        if not isinstance(phrase, dict):
            continue
        text = _pick_str(phrase, "text")
        translation = _pick_str(phrase, "translation")
        if not text or not translation:
            continue
        context = _pick_str(phrase, "context")
        line = f'- "{text}" = "{translation}"'
        if context:
            line += f" ({context})"
        lines.append(line)
    return "\n".join(lines)


def build_teacher_instructions(
    *,
    language_id: str | None = None,
    lesson_title: str | None = None,
    learner_name: str | None = None,
    custom_data: dict[str, Any] | None = None,
) -> str:
    data = custom_data or {}
    language_id = language_id or _pick_str(data, "language_id", "languageId")
    lesson_title = lesson_title or _pick_str(data, "lesson_title", "lessonTitle")
    learner_name = learner_name or _pick_str(data, "learner_name", "learnerName")

    ai_teacher = _pick_dict(data, "ai_teacher", "aiTeacher")
    system_prompt = _pick_str(ai_teacher, "system_prompt", "systemPrompt")
    focus_topics = _pick_list(ai_teacher, "focus_topics", "focusTopics")

    goals = _format_goals(_pick_list(data, "goals"))
    vocabulary = _format_vocabulary(_pick_list(data, "vocabulary"))
    phrases = _format_phrases(_pick_list(data, "phrases"))

    language_name = LANGUAGE_NAMES.get(language_id or "", "the selected language")
    title = lesson_title or "today's lesson"
    learner = learner_name or "the learner"
    focus = ", ".join(
        topic.strip()
        for topic in focus_topics
        if isinstance(topic, str) and topic.strip()
    )

    sections = [
        system_prompt or DEFAULT_INSTRUCTIONS,
        "",
        "Session context:",
        f"- Target language: {language_name}",
        f"- Lesson: {title}",
        f"- Learner name: {learner}",
        f"- Mode: voice-only audio lesson",
    ]

    if focus:
        sections.extend(["", f"Focus topics: {focus}"])

    if goals:
        sections.extend(["", "Lesson goals:", goals])

    if vocabulary:
        sections.extend(["", "Key vocabulary:", vocabulary])

    if phrases:
        sections.extend(["", "Key phrases:", phrases])

    return "\n".join(sections)


def build_opening_prompt(
    *,
    language_id: str | None = None,
    lesson_title: str | None = None,
    custom_data: dict[str, Any] | None = None,
) -> str:
    data = custom_data or {}
    language_id = language_id or _pick_str(data, "language_id", "languageId")
    lesson_title = lesson_title or _pick_str(data, "lesson_title", "lessonTitle")

    ai_teacher = _pick_dict(data, "ai_teacher", "aiTeacher")
    opening_line = _pick_str(ai_teacher, "opening_line", "openingLine")

    language_name = LANGUAGE_NAMES.get(language_id or "", "your new language")
    title = lesson_title or "today's lesson"

    if opening_line:
        return (
            f"You're starting a voice lesson as their {language_name} teacher. "
            f"Greet them warmly in natural English — sound human and upbeat, not robotic. "
            f'Today\'s lesson is "{title}". '
            f'Use this as your opening vibe (do not read it word-for-word): "{opening_line}" '
            f"Introduce one simple {language_name} word or phrase slowly, with the English meaning, "
            f"then **pause and wait** for them to repeat it back. Keep it to one or two short sentences. "
            f"**IMPORTANT: After you speak, STOP and listen. Do not continue speaking until you hear from the learner.**"
        )

    return (
        f"You're starting a voice lesson as their {language_name} teacher. "
        f"Greet them warmly in natural English — sound human and upbeat, not robotic. "
        f'Today\'s lesson is "{title}". '
        f"Introduce one simple {language_name} word or phrase slowly, with the English translation, "
        f"and **pause and wait** for them to repeat it. One or two short sentences only. "
        f"**IMPORTANT: After you speak, STOP and listen. Do not continue speaking until you hear from the learner.**"
    )
