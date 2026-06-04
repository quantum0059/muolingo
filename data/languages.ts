import type { Language, LanguageId } from "@/types/learning";

export const languages: Language[] = [
  {
    id: "es",
    name: "Spanish",
    nativeName: "Español",
    flagEmoji: "https://flagcdn.com/w320/es.png",
    shortDescription: "Start with greetings and everyday phrases.",
    learnerCount: "28.4M learners",
  },
  {
    id: "fr",
    name: "French",
    nativeName: "Français",
    flagEmoji: "https://flagcdn.com/w320/fr.png",
    shortDescription: "Learn polite introductions and café basics.",
    learnerCount: "19.4M learners",
  },
  {
    id: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flagEmoji: "https://flagcdn.com/w320/jp.png",
    shortDescription: "Master hiragana greetings and simple phrases.",
    learnerCount: "12.7M learners",
  },
  {
    id: "ko",
    name: "Korean",
    nativeName: "한국어",
    flagEmoji: "https://flagcdn.com/w320/kr.png",
    shortDescription: "Learn Hangul basics and everyday phrases.",
    learnerCount: "9.3M learners",
  },
  {
    id: "de",
    name: "German",
    nativeName: "Deutsch",
    flagEmoji: "https://flagcdn.com/w320/de.png",
    shortDescription: "Pick up greetings and travel essentials.",
    learnerCount: "8.1M learners",
  },
  {
    id: "zh",
    name: "Chinese",
    nativeName: "中文",
    flagEmoji: "https://flagcdn.com/w320/cn.png",
    shortDescription: "Start with tones and simple characters.",
    learnerCount: "7.4M learners",
  },
];

export function getLanguageById(id: LanguageId): Language | undefined {
  return languages.find((lang) => lang.id === id);
}

export function getAllLanguages(): Language[] {
  return languages;
}
