import { getLessonsForUnit } from "@/data/lessons";
import { getUnitsForLanguage } from "@/data/units";
import type { LanguageId, Lesson } from "@/types/learning";

export type LessonCardStatus = "completed" | "in_progress" | "locked";

export function getActiveUnitId(
  languageId: LanguageId,
  completedLessonIds: string[]
): string | undefined {
  const units = getUnitsForLanguage(languageId);
  for (const unit of units) {
    const unitLessons = getLessonsForUnit(unit.id);
    const hasIncomplete = unitLessons.some(
      (lesson) => !completedLessonIds.includes(lesson.id)
    );
    if (hasIncomplete) {
      return unit.id;
    }
  }
  return units[units.length - 1]?.id;
}

export function getLessonCardStatus(
  lesson: Lesson,
  unitLessons: Lesson[],
  completedLessonIds: string[]
): LessonCardStatus {
  if (completedLessonIds.includes(lesson.id)) {
    return "completed";
  }

  const firstIncomplete = unitLessons.find(
    (item) => !completedLessonIds.includes(item.id)
  );

  if (firstIncomplete?.id === lesson.id) {
    return "in_progress";
  }

  return "locked";
}

export function getUnitProgress(
  unitLessons: Lesson[],
  completedLessonIds: string[]
): { completed: number; total: number } {
  const completed = unitLessons.filter((lesson) =>
    completedLessonIds.includes(lesson.id)
  ).length;
  return { completed, total: unitLessons.length };
}
