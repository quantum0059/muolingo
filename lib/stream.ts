import { fetchApi } from "@/lib/api";

export const STREAM_API_KEY =
  process.env.EXPO_PUBLIC_STREAM_API_KEY ?? process.env.STREAM_API_KEY ?? "";

export type StreamTokenResponse = {
  apiKey: string;
  token: string;
  userId: string;
};

export type StreamCallResponse = {
  callId: string;
  callType: string;
};

export type AgentSessionResponse = {
  sessionId: string;
  callId: string;
  sessionStartedAt: string;
};

export async function fetchStreamToken(
  clerkToken: string,
): Promise<StreamTokenResponse> {
  const response = await fetchApi("/api/stream/token", {
    method: "GET",
    clerkToken,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? "Failed to fetch Stream token.");
  }

  return (await response.json()) as StreamTokenResponse;
}

export async function createStreamLessonCall(
  clerkToken: string,
  input: {
    lessonId: string;
    userName?: string;
  },
): Promise<StreamCallResponse> {
  const response = await fetchApi("/api/stream/call", {
    method: "POST",
    clerkToken,
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? "Failed to create Stream call.");
  }

  return (await response.json()) as StreamCallResponse;
}

export async function startVisionAgent(
  clerkToken: string,
  input: {
    callId: string;
    callType?: string;
  },
): Promise<AgentSessionResponse> {
  const response = await fetchApi("/api/agent/start", {
    method: "POST",
    clerkToken,
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? "Failed to start the AI teacher.");
  }

  return (await response.json()) as AgentSessionResponse;
}

export async function stopVisionAgent(
  clerkToken: string,
  input: {
    callId: string;
    sessionId: string;
  },
): Promise<void> {
  const response = await fetchApi("/api/agent/stop", {
    method: "DELETE",
    clerkToken,
    body: JSON.stringify(input),
  });

  if (!response.ok && response.status !== 202) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? "Failed to stop the AI teacher.");
  }
}

export function buildLessonCallId(lessonId: string): string {
  return `lesson-${lessonId}`;
}
