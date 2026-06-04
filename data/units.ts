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
];

export function getUnitsForLanguage(languageId: LanguageId): Unit[] {
  return units
    .filter((unit) => unit.languageId === languageId)
    .sort((a, b) => a.order - b.order);
}

export function getUnitById(unitId: string): Unit | undefined {
  return units.find((unit) => unit.id === unitId);
}
