import { getAuthenticatedClerkUser } from "@/lib/server/clerk-auth";
import { getLanguageById } from "@/data/languages";
import type { LanguageId } from "@/types/learning";

export async function POST(request: Request) {
  try {
    const clerkUser = await getAuthenticatedClerkUser(request);
    if (!clerkUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messages, languageId } = body as {
      messages: { role: string; content: string }[];
      languageId: LanguageId;
    };

    if (!messages || !Array.isArray(messages) || !languageId) {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const language = getLanguageById(languageId);
    if (!language) {
      return Response.json({ error: "Invalid language ID" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

    if (!apiKey) {
      return Response.json(
        { error: "Groq credentials are not configured on the server." },
        { status: 500 }
      );
    }

    const systemPrompt = {
      role: "system",
      content: `You are a helpful and friendly AI language tutor. 
Your primary goal is to help the user practice the ${language.name} (${language.nativeName}) language.
You can converse in ${language.name}, explain grammar, teach vocabulary, and talk about the culture and history related to the ${language.name} language.
CRITICAL INSTRUCTION: You must strictly decline requests to talk about anything outside of the ${language.name} language, its culture, or its history. If the user asks an off-topic question, politely refuse and steer the conversation back to ${language.name}.
Keep your responses relatively concise, friendly, and suitable for a mobile chat interface. Use emojis occasionally.`,
    };

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [systemPrompt, ...messages],
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error("Groq API error:", errorData);
      return Response.json(
        { error: "Failed to fetch response from Groq API" },
        { status: groqResponse.status }
      );
    }

    const data = await groqResponse.json();
    
    return Response.json({
      message: data.choices[0].message,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to process chat request.",
      },
      { status: 500 }
    );
  }
}
