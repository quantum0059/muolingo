import { getAuthenticatedClerkUser } from "@/lib/server/clerk-auth";
import { stopVisionAgentSession } from "@/lib/server/vision-agent";

type StopAgentBody = {
  callId?: string;
  sessionId?: string;
};

export async function DELETE(request: Request) {
  try {
    const clerkUser = await getAuthenticatedClerkUser(request);
    if (!clerkUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as StopAgentBody;
    const { callId, sessionId } = body;

    if (!callId || !sessionId) {
      return Response.json(
        { error: "callId and sessionId are required." },
        { status: 400 },
      );
    }

    await stopVisionAgentSession({ callId, sessionId });

    return new Response(null, { status: 202 });
  } catch (error) {
    console.error("Vision agent stop error:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to stop the AI teacher.",
      },
      { status: 500 },
    );
  }
}
