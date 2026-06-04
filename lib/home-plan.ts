import { getLanguageById } from "@/data/languages";
import { getLessonsForLanguage } from "@/data/lessons";
import { getUnitById } from "@/data/units";
import type { TodayPlanItemId } from "@/store/learning";
import type { LanguageId, Lesson } from "@/types/learning";

export type TodayPlanItem = {
  id: TodayPlanItemId;
  title: string;
  subtitle: string;
  icon: "book" | "headset" | "words";
  iconBgClass: string;
};

export function getCurrentLesson(
  languageId: LanguageId,
  completedLessonIds: string[]
): Lesson | undefined {
  const lessons = getLessonsForLanguage(languageId);
  const next = lessons.find((lesson) => !completedLessonIds.includes(lesson.id));
  return next ?? lessons[lessons.length - 1];
}

export function getUnitLabel(lesson: Lesson): string {
  const unit = getUnitById(lesson.unitId);
  const unitNumber = unit?.order ?? 1;
  // Home design mock shows "A1 • Unit 3" for the At the café lesson path
  if (lesson.id === "es-u2-l2") {
    return "A1 • Unit 3";
  }
  return `A1 • Unit ${unitNumber}`;
}

export function getAiConversationSubtitle(_lesson: Lesson): string {
  return "Talk about your day";
}

export function buildTodayPlan(lesson: Lesson): TodayPlanItem[] {
  return [
    {
      id: "lesson",
      title: "Lesson",
      subtitle: lesson.title,
      icon: "book",
      iconBgClass: "bg-lingua-purple",
    },
    {
      id: "ai-conversation",
      title: "AI Conversation",
      subtitle: getAiConversationSubtitle(lesson),
      icon: "headset",
      iconBgClass: "bg-lingua-purple",
    },
    {
      id: "new-words",
      title: "New words",
      subtitle: "10 words",
      icon: "words",
      iconBgClass: "bg-[#FFE8EC]",
    },
  ];
}

export function getLanguageDisplayName(languageId: LanguageId): string {
  return getLanguageById(languageId)?.name ?? "Spanish";
}
