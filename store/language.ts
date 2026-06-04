import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LanguageId } from "@/types/learning";

export const LANGUAGE_STORAGE_KEY = "language-storage";

type LanguageState = {
  selectedLanguageId: LanguageId | null;
  setSelectedLanguage: (id: LanguageId) => void;
  clearSelectedLanguage: () => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      setSelectedLanguage: (id) => set({ selectedLanguageId: id }),
      clearSelectedLanguage: () => set({ selectedLanguageId: null }),
    }),
    {
      name: LANGUAGE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedLanguageId: state.selectedLanguageId,
      }),
    }
  )
);

export async function clearLanguageStorage() {
  await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY);
  useLanguageStore.setState({ selectedLanguageId: null });
}
