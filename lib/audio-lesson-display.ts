import { getLanguageById } from "@/data/languages";
import type { Lesson } from "@/types/learning";

export type TeacherBubble = {
  phrase: string;
  translation: string;
};

export type LessonFeedback = {
  speaking: string;
  pronunciation: string;
  grammar: string;
};

const DEFAULT_BUBBLE: TeacherBubble = {
  phrase: "¡Muy bien!",
  translation: "That was great! 👏",
};

const DEFAULT_FEEDBACK: LessonFeedback = {
  speaking: "Excellent",
  pronunciation: "Great",
  grammar: "Good",
};

/** Encouraging bubble copy derived from lesson phrases or AI teacher opening line */
export function getTeacherBubble(lesson: Lesson): TeacherBubble {
  const primaryPhrase = lesson.phrases[0];
  if (primaryPhrase) {
    return {
      phrase: primaryPhrase.text,
      translation: primaryPhrase.translation,
    };
  }

  const opening = lesson.aiTeacher.openingLine.trim();
  if (opening.length > 0) {
    const shortOpening =
      opening.length > 72 ? `${opening.slice(0, 69)}…` : opening;
    return {
      phrase: lesson.title,
      translation: shortOpening,
    };
  }

  return DEFAULT_BUBBLE;
}

export function getLessonGoalSummary(lesson: Lesson): string {
  if (lesson.goals.length > 0) {
    return lesson.goals.map((goal) => goal.description).join(" • ");
  }
  return lesson.description;
}

export function getLanguageLabel(lesson: Lesson): string {
  return getLanguageById(lesson.languageId)?.name ?? lesson.languageId;
}

export function getSessionFeedback(): LessonFeedback {
  return DEFAULT_FEEDBACK;
}
