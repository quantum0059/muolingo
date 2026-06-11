import type { Lesson } from "@/types/learning";

export type LessonCallCustomData = {
  lesson_id: string;
  language_id: string;
  lesson_title: string;
  learner_name: string | null;
  mode: "audio_lesson";
  goals: Array<{ id: string; description: string }>;
  vocabulary: Array<{
    id: string;
    word: string;
    translation: string;
    pronunciation?: string;
    example?: string;
  }>;
  phrases: Array<{
    id: string;
    text: string;
    translation: string;
    context?: string;
  }>;
  ai_teacher: {
    system_prompt: string;
    opening_line: string;
    focus_topics: string[];
    estimated_minutes: number;
  };
};

export function buildLessonCallCustomData(
  lesson: Lesson,
  userName?: string,
): LessonCallCustomData {
  return {
    lesson_id: lesson.id,
    language_id: lesson.languageId,
    lesson_title: lesson.title,
    learner_name: userName ?? null,
    mode: "audio_lesson",
    goals: lesson.goals.map((goal) => ({
      id: goal.id,
      description: goal.description,
    })),
    vocabulary: lesson.vocabulary.map((item) => ({
      id: item.id,
      word: item.word,
      translation: item.translation,
      pronunciation: item.pronunciation,
      example: item.example,
    })),
    phrases: lesson.phrases.map((phrase) => ({
      id: phrase.id,
      text: phrase.text,
      translation: phrase.translation,
      context: phrase.context,
    })),
    ai_teacher: {
      system_prompt: lesson.aiTeacher.systemPrompt,
      opening_line: lesson.aiTeacher.openingLine,
      focus_topics: lesson.aiTeacher.focusTopics,
      estimated_minutes: lesson.aiTeacher.estimatedMinutes,
    },
  };
}
