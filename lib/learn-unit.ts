import { getUnitById, getUnitsForLanguage } from "@/data/units";
import type { LanguageId } from "@/types/learning";

/**
 * Unit shown on the Learn tab — matches prompt_material/06-lesson-screen.png
 * (Unit 3 lesson path with 6 lessons) when available for the language.
 */
export function getLearnScreenUnitId(languageId: LanguageId): string | undefined {
  const featuredUnitId = `${languageId}-unit-3`;
  if (getUnitById(featuredUnitId)) {
    return featuredUnitId;
  }

  const units = getUnitsForLanguage(languageId);
  return units[units.length - 1]?.id;
}
