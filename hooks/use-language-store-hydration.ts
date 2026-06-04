import { useEffect, useState } from "react";

import { useLanguageStore } from "@/store/language";

export function useLanguageStoreHydration() {
  const [hasHydrated, setHasHydrated] = useState(
    useLanguageStore.persist.hasHydrated()
  );

  useEffect(() => {
    const unsubscribe = useLanguageStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    if (!useLanguageStore.persist.hasHydrated()) {
      void useLanguageStore.persist.rehydrate();
    }

    return unsubscribe;
  }, []);

  return hasHydrated;
}
