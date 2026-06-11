import { type LessonCallCustomData } from "@/lib/server/lesson-call-data";
import { createStreamUserToken } from "@/lib/server/stream-jwt";

const STREAM_VIDEO_API_BASE = "https://video.stream-io-api.com/api/v2";

type CreateLessonCallInput = {
  callId: string;
  userId: string;
  custom: LessonCallCustomData;
};

type CreateLessonCallResult = {
  callId: string;
  callType: string;
};

function getStreamConfig() {
  const apiKey = process.env.STREAM_API_KEY;
  const secret = process.env.STREAM_SECRET_KEY?.trim();

  if (!apiKey || !secret) {
    throw new Error("STREAM_API_KEY and STREAM_SECRET_KEY must be configured.");
  }

  return { apiKey, secret };
}

function getRetryDelayMs(response: Response, attempt: number): number {
  const retryAfter = response.headers.get("Retry-After");
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (!Number.isNaN(seconds) && seconds > 0) {
      return seconds * 1000;
    }
  }

  return Math.min(1000 * 2 ** attempt, 8000);
}

async function postStreamCall(
  url: string,
  token: string,
  body: string,
): Promise<Response> {
  const maxAttempts = 4;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        "Stream-Auth-Type": "jwt",
      },
      body,
    });

    if (response.ok || response.status !== 429 || attempt === maxAttempts - 1) {
      return response;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, getRetryDelayMs(response, attempt)),
    );
  }

  throw new Error("Failed to create Stream call after retries.");
}

export async function grantLearnerSendAudioForUser(
  callType: string,
  callId: string,
  userId: string,
): Promise<void> {
  const { apiKey, secret } = getStreamConfig();
  const serverToken = await createStreamUserToken(userId, secret);
  await grantLearnerSendAudio(
    callType,
    callId,
    userId,
    serverToken,
    apiKey,
  );
}

async function grantLearnerSendAudio(
  callType: string,
  callId: string,
  userId: string,
  token: string,
  apiKey: string,
): Promise<void> {
  const response = await fetch(
    `${STREAM_VIDEO_API_BASE}/video/call/${callType}/${callId}/user_permissions?api_key=${apiKey}`,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        "Stream-Auth-Type": "jwt",
      },
      body: JSON.stringify({
        user_id: userId,
        grant_permissions: ["send-audio"],
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to grant microphone access (${response.status}): ${errorBody}`,
    );
  }
}

export async function createLessonAudioCall(
  input: CreateLessonCallInput,
): Promise<CreateLessonCallResult> {
  const { apiKey, secret } = getStreamConfig();
  const callType = "audio_room";
  const serverToken = await createStreamUserToken(input.userId, secret);

  const response = await postStreamCall(
    `${STREAM_VIDEO_API_BASE}/video/call/${callType}/${input.callId}?api_key=${apiKey}`,
    serverToken,
    JSON.stringify({
      data: {
        created_by_id: input.userId,
        custom: input.custom,
        members: [{ user_id: input.userId, role: "admin" }],
        settings_override: {
          audio: {
            mic_default_on: true,
            default_device: "speaker",
          },
          transcription: {
            mode: "auto-on",
            closed_caption_mode: "auto-on",
            language: "en",
            speech_segment_config: {
              max_speech_caption_ms: 6000,
              silence_duration_ms: 600,
            },
          },
        },
      },
    }),
  );

  if (!response.ok) {
    const errorBody = await response.text();
    if (response.status === 429) {
      throw new Error(
        "Stream rate limit reached. Wait a few seconds, then tap Retry.",
      );
    }
    throw new Error(
      `Failed to create Stream call (${response.status}): ${errorBody}`,
    );
  }

  await grantLearnerSendAudio(
    callType,
    input.callId,
    input.userId,
    serverToken,
    apiKey,
  );

  return {
    callId: input.callId,
    callType,
  };
}
