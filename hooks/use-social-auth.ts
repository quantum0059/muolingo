import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

type OAuthStrategy = "oauth_google" | "oauth_apple" | "oauth_facebook";

export function useSocialAuth() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const redirectUrl = AuthSession.makeRedirectUri({ path: "oauth-callback" });
  const [socialError, setSocialError] = useState<string | null>(null);

  const clearSocialError = useCallback(() => {
    setSocialError(null);
  }, []);

  const signInWithOAuth = useCallback(
    async (strategy: OAuthStrategy) => {
      setSocialError(null);

      try {
        const { createdSessionId, setActive, authSessionResult } =
          await startSSOFlow({
            strategy,
            redirectUrl,
          });

        if (
          authSessionResult?.type === "cancel" ||
          authSessionResult?.type === "dismiss"
        ) {
          return;
        }

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          router.replace("/");
        }
      } catch (error) {
        console.error(error);
        setSocialError("Something went wrong. Please try again.");
      }
    },
    [redirectUrl, router, startSSOFlow],
  );

  return { signInWithOAuth, socialError, clearSocialError, setSocialError };
}
