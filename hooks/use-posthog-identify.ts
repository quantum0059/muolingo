import { useAuth, useUser } from "@clerk/expo";
import { useEffect, useRef } from "react";

import { identifyClerkUser } from "@/lib/posthog-identify";
import { useLanguageStore } from "@/store/language";

export function usePostHogIdentify() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const lastIdentifiedRef = useRef<{
    userId?: string;
    language?: string | null;
  }>({});

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      return;
    }

    const last = lastIdentifiedRef.current;
    if (last.userId === user.id && last.language === selectedLanguageId) {
      return;
    }

    identifyClerkUser(user.id);
    lastIdentifiedRef.current = {
      userId: user.id,
      language: selectedLanguageId,
    };
  }, [isLoaded, isSignedIn, user?.id, selectedLanguageId]);
}
