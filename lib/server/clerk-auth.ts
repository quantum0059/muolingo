import { createClerkClient } from "@clerk/backend";

type AuthenticatedClerkUser = {
  userId: string;
  sessionId: string | null;
};

function getClerkSecretKey(): string | null {
  return process.env.CLERK_SECRET_KEY?.trim() ?? null;
}

function getClerkPublishableKey(): string | null {
  return (
    process.env.CLERK_PUBLISHABLE_KEY?.trim() ??
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() ??
    null
  );
}

export async function getAuthenticatedClerkUser(
  request: Request,
): Promise<AuthenticatedClerkUser | null> {
  const secretKey = getClerkSecretKey();
  if (!secretKey) {
    throw new Error(
      "CLERK_SECRET_KEY is not configured on the server. Add it to .env or your deployment environment.",
    );
  }

  const publishableKey = getClerkPublishableKey();
  if (!publishableKey) {
    throw new Error(
      "CLERK_PUBLISHABLE_KEY (or EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) is not configured on the server. Add it to .env or your deployment environment.",
    );
  }

  const clerk = createClerkClient({ secretKey, publishableKey });
  const requestState = await clerk.authenticateRequest(request);

  if (!requestState.isSignedIn) {
    return null;
  }

  const auth = requestState.toAuth();
  if (!auth.userId) {
    return null;
  }

  return {
    userId: auth.userId,
    sessionId: auth.sessionId,
  };
}
