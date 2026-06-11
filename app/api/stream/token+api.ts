import { getAuthenticatedClerkUser } from "@/lib/server/clerk-auth";
import { createStreamUserToken } from "@/lib/server/stream-jwt";

export async function GET(request: Request) {
  try {
    const clerkUser = await getAuthenticatedClerkUser(request);
    if (!clerkUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.STREAM_API_KEY;
    const secret = process.env.STREAM_SECRET_KEY?.trim();

    if (!apiKey || !secret) {
      return Response.json(
        { error: "Stream credentials are not configured on the server." },
        { status: 500 },
      );
    }

    const token = await createStreamUserToken(clerkUser.userId, secret);

    return Response.json({
      apiKey,
      token,
      userId: clerkUser.userId,
    });
  } catch (error) {
    console.error("Stream token error:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create Stream token.",
      },
      { status: 500 },
    );
  }
}
