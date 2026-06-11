import { posthog } from "@/lib/posthog";
import { useLanguageStore } from "@/store/language";

let pendingSignupIdentify = false;

export function markNewSignup() {
  pendingSignupIdentify = true;
}

export function clearPendingSignup() {
  pendingSignupIdentify = false;
}

export function identifyClerkUser(userId: string) {
  const preferredLanguage = useLanguageStore.getState().selectedLanguageId;

  const properties: Record<string, unknown> = {
    $set: {
      preferred_language: preferredLanguage ?? null,
    },
  };

  if (pendingSignupIdentify) {
    properties.$set_once = {
      signup_date: new Date().toISOString(),
    };
    pendingSignupIdentify = false;
  }

  posthog.identify(userId, properties);
}
