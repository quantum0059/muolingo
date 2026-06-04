/** Supported target languages users can learn */
export type LanguageId = "es" | "fr" | "ja" | "ko" | "de" | "zh";

export type Language = {
  id: LanguageId;
  /** Display name in English (UI language) */
  name: string;
  /** Name in the target language */
  nativeName: string;
  flagEmoji: string;
  shortDescription: string;
  /** Display string for social proof (e.g. "28.4M learners") */
  learnerCount: string;
};

export type ActivityType =
  | "vocabulary"
  | "phrase_practice"
  | "listening"
  | "speaking"
  | "chat"
  | "video_teacher"
  | "review";

export type VocabularyItem = {
  id: string;
  word: string;
  translation: string;
  /** Optional phonetic hint for learners */
  pronunciation?: string;
  example?: string;
};

export type Phrase = {
  id: string;
  text: string;
  translation: string;
  /** When or how to use this phrase */
  context?: string;
};

export type LessonGoal = {
  id: string;
  description: string;
};

/**
 * Prompts for future Vision Agent / audio AI teacher sessions.
 * The teacher speaks English and teaches the target language.
 */
export type AiTeacherPrompt = {
  systemPrompt: string;
  openingLine: string;
  focusTopics: string[];
  /** Suggested session length for UI copy */
  estimatedMinutes: number;
};

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  xpReward: number;
  vocabulary?: VocabularyItem[];
  phrases?: Phrase[];
};

export type Lesson = {
  id: string;
  languageId: LanguageId;
  unitId: string;
  title: string;
  subtitle: string;
  description: string;
  /** Sort order within the unit (1-based) */
  order: number;
  xpReward: number;
  estimatedMinutes: number;
  /** Key for lesson card imagery (resolved in UI layer) */
  imageKey: string;
  goals: LessonGoal[];
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  activities: Activity[];
  aiTeacher: AiTeacherPrompt;
};

export type Unit = {
  id: string;
  languageId: LanguageId;
  title: string;
  description: string;
  order: number;
  lessonIds: string[];
};
