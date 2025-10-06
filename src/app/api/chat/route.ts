import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Create conversation context from history
    let conversationContext = "";
    interface ConversationMessage {
      role: "user" | "assistant";
      content: string;
    }


    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext =
        conversationHistory
          .map(
            (msg: ConversationMessage): string =>
              `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
          )
          .join("\n") + "\n\n";
    }

    // Create AI prompt for ChatGPT-like responses
    const systemPrompt = `You are ChatGPT, an AI assistant created by OpenAI. You are helpful, harmless, and honest. You can engage in conversations, answer questions, provide explanations, help with creative tasks, solve problems, and assist with a wide variety of topics. You should be conversational, friendly, and provide detailed, helpful responses when appropriate.

Guidelines:
- Be helpful, accurate, and detailed in your responses
- If you're unsure about something, say so rather than guessing
- Be conversational and engaging
- Provide examples when helpful
- Ask clarifying questions when needed
- Maintain a helpful and professional tone`;

    const userPrompt = `${conversationContext}User: ${message}

Please respond as ChatGPT would:`;

    // Create AI client wrapper for Gemini
    const geminiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\n${userPrompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.8,
        topK: 40,
      },
    };

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      throw new Error("Invalid response format from Gemini API");
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    // Structure the response
    const result = {
      success: true,
      message: aiResponse,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Failed to get AI response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
