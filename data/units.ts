import type { LanguageId, Unit } from "@/types/learning";

export const units: Unit[] = [
  // Spanish
  {
    id: "es-unit-1",
    languageId: "es",
    title: "Basics 1",
    description: "Greetings, introductions, and simple questions.",
    order: 1,
    lessonIds: ["es-u1-l1", "es-u1-l2", "es-u1-l3"],
  },
  {
    id: "es-unit-2",
    languageId: "es",
    title: "Travel",
    description: "Directions, ordering food, and getting around.",
    order: 2,
    lessonIds: ["es-u2-l1", "es-u2-l2"],
  },
  // French
  {
    id: "fr-unit-1",
    languageId: "fr",
    title: "Basics 1",
    description: "Bonjour, polite phrases, and café essentials.",
    order: 1,
    lessonIds: ["fr-u1-l1", "fr-u1-l2", "fr-u1-l3"],
  },
  {
    id: "fr-unit-2",
    languageId: "fr",
    title: "Around Town",
    description: "Asking for help and simple directions.",
    order: 2,
    lessonIds: ["fr-u2-l1", "fr-u2-l2"],
  },
  // Japanese
  {
    id: "ja-unit-1",
    languageId: "ja",
    title: "Basics 1",
    description: "Hiragana greetings and polite introductions.",
    order: 1,
    lessonIds: ["ja-u1-l1", "ja-u1-l2", "ja-u1-l3"],
  },
  {
    id: "ja-unit-2",
    languageId: "ja",
    title: "Daily Life",
    description: "Numbers, thanks, and simple requests.",
    order: 2,
    lessonIds: ["ja-u2-l1", "ja-u2-l2"],
  },
  {
    id: "es-unit-3",
    languageId: "es",
    title: "At the Café",
    description: "Order drinks, shop, and talk about family.",
    order: 3,
    lessonIds: [
      "es-u3-l1",
      "es-u3-l2",
      "es-u3-l3",
      "es-u3-l4",
      "es-u3-l5",
      "es-u3-l6",
    ],
  },
  {
    id: "fr-unit-3",
    languageId: "fr",
    title: "At the Café",
    description: "Order drinks, shop, and talk about family.",
    order: 3,
    lessonIds: [
      "fr-u3-l1",
      "fr-u3-l2",
      "fr-u3-l3",
      "fr-u3-l4",
      "fr-u3-l5",
      "fr-u3-l6",
    ],
  },
  {
    id: "ja-unit-3",
    languageId: "ja",
    title: "At the Café",
    description: "Order drinks, shop, and talk about family.",
    order: 3,
    lessonIds: [
      "ja-u3-l1",
      "ja-u3-l2",
      "ja-u3-l3",
      "ja-u3-l4",
      "ja-u3-l5",
      "ja-u3-l6",
    ],
  },
  {
    id: "ko-unit-1",
    languageId: "ko",
    title: "Basics 1",
    description: "Hangul greetings and introductions.",
    order: 1,
    lessonIds: ["ko-u1-l1"],
  },
  {
    id: "de-unit-1",
    languageId: "de",
    title: "Basics 1",
    description: "German greetings and everyday phrases.",
    order: 1,
    lessonIds: ["de-u1-l1"],
  },
  {
    id: "zh-unit-1",
    languageId: "zh",
    title: "Basics 1",
    description: "Chinese greetings and simple phrases.",
    order: 1,
    lessonIds: ["zh-u1-l1"],
  },
  {
    id: "ko-unit-3",
    languageId: "ko",
    title: "At the Café",
    description: "Order drinks, shop, and talk about family.",
    order: 3,
    lessonIds: [
      "ko-u3-l1",
      "ko-u3-l2",
      "ko-u3-l3",
      "ko-u3-l4",
      "ko-u3-l5",
      "ko-u3-l6",
    ],
  },
  {
    id: "de-unit-3",
    languageId: "de",
    title: "At the Café",
    description: "Order drinks, shop, and talk about family.",
    order: 3,
    lessonIds: [
      "de-u3-l1",
      "de-u3-l2",
      "de-u3-l3",
      "de-u3-l4",
      "de-u3-l5",
      "de-u3-l6",
    ],
  },
  {
    id: "zh-unit-3",
    languageId: "zh",
    title: "At the Café",
    description: "Order drinks, shop, and talk about family.",
    order: 3,
    lessonIds: [
      "zh-u3-l1",
      "zh-u3-l2",
      "zh-u3-l3",
      "zh-u3-l4",
      "zh-u3-l5",
      "zh-u3-l6",
    ],
  },
];

export function getUnitsForLanguage(languageId: LanguageId): Unit[] {
  return units
    .filter((unit) => unit.languageId === languageId)
    .sort((a, b) => a.order - b.order);
}

export function getUnitById(unitId: string): Unit | undefined {
  return units.find((unit) => unit.id === unitId);
}
