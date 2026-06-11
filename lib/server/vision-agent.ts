const DEFAULT_VISION_AGENT_URL = "http://127.0.0.1:8000";

export type StartAgentSessionResult = {
  sessionId: string;
  callId: string;
  sessionStartedAt: string;
};

function getVisionAgentBaseUrl(): string {
  const configured = process.env.VISION_AGENT_URL?.replace(/\/$/u, "");
  return configured || DEFAULT_VISION_AGENT_URL;
}

export async function startVisionAgentSession(input: {
  callId: string;
  callType?: string;
}): Promise<StartAgentSessionResult> {
  const response = await fetch(
    `${getVisionAgentBaseUrl()}/calls/${encodeURIComponent(input.callId)}/sessions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        call_type: input.callType ?? "audio_room",
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to start vision agent session (${response.status}): ${body}`,
    );
  }

  const payload = (await response.json()) as {
    session_id: string;
    call_id: string;
    session_started_at: string;
  };

  return {
    sessionId: payload.session_id,
    callId: payload.call_id,
    sessionStartedAt: payload.session_started_at,
  };
}

export async function stopVisionAgentSession(input: {
  callId: string;
  sessionId: string;
}): Promise<void> {
  const response = await fetch(
    `${getVisionAgentBaseUrl()}/calls/${encodeURIComponent(input.callId)}/sessions/${encodeURIComponent(input.sessionId)}`,
    {
      method: "DELETE",
    },
  );

  if (response.status === 404) {
    return;
  }

  if (!response.ok && response.status !== 202) {
    const body = await response.text();
    throw new Error(
      `Failed to stop vision agent session (${response.status}): ${body}`,
    );
  }
}
