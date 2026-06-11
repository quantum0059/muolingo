import { getAuthenticatedClerkUser } from "@/lib/server/clerk-auth";
import { grantLearnerSendAudioForUser } from "@/lib/server/stream-call";
import { startVisionAgentSession } from "@/lib/server/vision-agent";

type StartAgentBody = {
  callId?: string;
  callType?: string;
};

export async function POST(request: Request) {
  try {
    const clerkUser = await getAuthenticatedClerkUser(request);
    if (!clerkUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as StartAgentBody;
    const { callId, callType } = body;

    if (!callId) {
      return Response.json({ error: "callId is required." }, { status: 400 });
    }

    const session = await startVisionAgentSession({ callId, callType });

    // Wait a moment for the learner to join the call before granting permissions
    // This prevents the race condition where agent starts before learner joins
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Re-grant after the agent goes live so the learner can publish in audio_room.
    try {
      await grantLearnerSendAudioForUser(
        callType ?? "audio_room",
        callId,
        clerkUser.userId,
      );
    } catch (grantError) {
      console.warn("Failed to grant learner send-audio on agent start:", grantError);
    }

    return Response.json(session, { status: 201 });
  } catch (error) {
    console.error("Vision agent start error:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to start the AI teacher.",
      },
      { status: 500 },
    );
  }
}
