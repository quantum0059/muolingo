import { getLessonById } from "@/data/lessons";
import { getAuthenticatedClerkUser } from "@/lib/server/clerk-auth";
import { buildLessonCallCustomData } from "@/lib/server/lesson-call-data";
import { createLessonAudioCall } from "@/lib/server/stream-call";

type CreateCallBody = {
  lessonId?: string;
  userName?: string;
};

export async function POST(request: Request) {
  try {
    const clerkUser = await getAuthenticatedClerkUser(request);
    if (!clerkUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreateCallBody;
    const { lessonId, userName } = body;

    if (!lessonId) {
      return Response.json({ error: "lessonId is required." }, { status: 400 });
    }

    const lesson = getLessonById(lessonId);
    if (!lesson) {
      return Response.json({ error: "Lesson not found." }, { status: 404 });
    }

    const callId = `lesson-${lessonId}`;
    const call = await createLessonAudioCall({
      callId,
      userId: clerkUser.userId,
      custom: buildLessonCallCustomData(lesson, userName),
    });

    return Response.json(call);
  } catch (error) {
    console.error("Stream call creation error:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create Stream call.",
      },
      { status: 500 },
    );
  }
}
