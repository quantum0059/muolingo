import type { LanguageId, Lesson } from "@/types/learning";

function buildAiTeacherPrompt(
  languageName: string,
  lessonTitle: string,
  focusTopics: string[],
  openingLine: string,
): Lesson["aiTeacher"] {
  return {
    systemPrompt: `You are a friendly AI language teacher. Always speak in clear English. Teach ${languageName} to an English-speaking beginner. Stay on topic for "${lessonTitle}". Use short sentences, repeat key phrases, and encourage the learner to speak aloud.`,
    openingLine,
    focusTopics,
    estimatedMinutes: 5,
  };
}

type PathLessonConfig = {
  id: string;
  languageId: LanguageId;
  unitId: string;
  title: string;
  subtitle: string;
  order: number;
  imageKey: string;
  languageName: string;
};

function createPathLesson(config: PathLessonConfig): Lesson {
  const {
    id,
    languageId,
    unitId,
    title,
    subtitle,
    order,
    imageKey,
    languageName,
  } = config;

  return {
    id,
    languageId,
    unitId,
    title,
    subtitle,
    description: `Learn ${title.toLowerCase()} in ${languageName}.`,
    order,
    xpReward: 10,
    estimatedMinutes: 6,
    imageKey,
    goals: [{ id: "g1", description: `Complete ${title}` }],
    vocabulary: [
      {
        id: "v1",
        word: "—",
        translation: "Vocabulary coming soon",
      },
    ],
    phrases: [
      {
        id: "p1",
        text: "—",
        translation: "Phrases coming soon",
      },
    ],
    activities: [
      {
        id: "a1",
        type: "vocabulary",
        title: "Learn the words",
        description: "Match new words to meanings.",
        xpReward: 5,
      },
    ],
    aiTeacher: buildAiTeacherPrompt(
      languageName,
      title,
      [title],
      `Let's start "${title}" in ${languageName}!`,
    ),
  };
}

const PATH_LESSON_TITLES = [
  { title: "Greetings & Introductions", subtitle: "Basics", imageKey: "lesson-greetings" },
  { title: "Daily Life", subtitle: "Routine", imageKey: "lesson-daily" },
  { title: "At the Café", subtitle: "Ordering", imageKey: "lesson-cafe" },
  { title: "Travel & Directions", subtitle: "Getting around", imageKey: "lesson-travel" },
  { title: "Shopping", subtitle: "Stores", imageKey: "lesson-shopping" },
  { title: "Family & Friends", subtitle: "People", imageKey: "lesson-family" },
] as const;

const PATH_LANGUAGES: { id: LanguageId; name: string }[] = [
  { id: "es", name: "Spanish" },
  { id: "fr", name: "French" },
  { id: "ja", name: "Japanese" },
  { id: "ko", name: "Korean" },
  { id: "de", name: "German" },
  { id: "zh", name: "Chinese" },
];

/** Unit 3 path lessons — matches lesson screen design (6 lessons per language) */
export function buildUnit3PathLessons(): Lesson[] {
  return PATH_LANGUAGES.flatMap(({ id: languageId, name: languageName }) =>
    PATH_LESSON_TITLES.map((item, index) =>
      createPathLesson({
        id: `${languageId}-u3-l${index + 1}`,
        languageId,
        unitId: `${languageId}-unit-3`,
        title: item.title,
        subtitle: item.subtitle,
        order: index + 1,
        imageKey: item.imageKey,
        languageName,
      })
    )
  );
}

/** Starter lessons for languages that had no content yet */
export function buildBasicsLessons(): Lesson[] {
  const starters: PathLessonConfig[] = [
    {
      id: "ko-u1-l1",
      languageId: "ko",
      unitId: "ko-unit-1",
      title: "안녕하세요",
      subtitle: "Greetings",
      order: 1,
      imageKey: "lesson-greetings",
      languageName: "Korean",
    },
    {
      id: "de-u1-l1",
      languageId: "de",
      unitId: "de-unit-1",
      title: "Hallo!",
      subtitle: "Greetings",
      order: 1,
      imageKey: "lesson-greetings",
      languageName: "German",
    },
    {
      id: "zh-u1-l1",
      languageId: "zh",
      unitId: "zh-unit-1",
      title: "你好",
      subtitle: "Greetings",
      order: 1,
      imageKey: "lesson-greetings",
      languageName: "Chinese",
    },
  ];

  return starters.map(createPathLesson);
}
