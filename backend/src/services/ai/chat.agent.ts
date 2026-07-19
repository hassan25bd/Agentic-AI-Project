import { getGeminiClient, GEMINI_MODEL_NAME, summarizeGeminiError } from "./gemini.client";
import { toolDeclarations, executeTool } from "./tools";
import { ChatMessage, IToolCallRecord } from "../../models/ChatMessage";

export type ChatAgentEvent =
  | { type: "text_delta"; text: string }
  | { type: "tool_call"; tool: string; args: Record<string, unknown> }
  | { type: "tool_result"; tool: string; result: unknown }
  | { type: "done"; reply: string; suggestions: string[] }
  | { type: "error"; message: string };

const SYSTEM_INSTRUCTION = `You are the Voyager Concierge, an agentic travel-planning assistant embedded in the Voyager app (a platform for booking curated travel experiences).

Behavior rules:
- Ground every factual claim about experiences, prices, or availability in tool results. Never invent listing details - call search_experiences or get_experience_details instead of guessing.
- Think step by step: decide if you need information, call the right tool, read the result, and only then answer.
- Keep answers concise, warm, and practical (a few sentences or a short list). Use the traveler's stated budget/interests if they mention them.
- If the traveler asks something unrelated to travel/Voyager, answer briefly and steer back to how you can help them plan a trip.
- You can call tools more than once in a turn if you need to look up multiple things, but do not call the same tool with the same arguments twice.`;

const MAX_TOOL_ITERATIONS = 4;
const HISTORY_WINDOW = 20;

function buildSuggestions(toolCalls: IToolCallRecord[]): string[] {
  const lastTool = toolCalls[toolCalls.length - 1]?.tool;

  if (lastTool === "search_experiences") {
    return [
      "Tell me more about the top result",
      "Are there cheaper options?",
      "Build a day-by-day itinerary around this",
    ];
  }
  if (lastTool === "get_experience_details") {
    return [
      "Are there similar experiences nearby?",
      "What's the best time of year to go?",
      "Add this to a multi-day itinerary",
    ];
  }
  return [
    "Recommend experiences based on my interests",
    "Help me plan a 5-day trip on a mid-range budget",
    "What categories of experiences do you offer?",
  ];
}

export async function* runChatAgent(
  userId: string,
  sessionId: string,
  message: string
): AsyncGenerator<ChatAgentEvent> {
  await ChatMessage.create({ user: userId, sessionId, role: "user", content: message });

  const history = await ChatMessage.find({ user: userId, sessionId })
    .sort({ createdAt: -1 })
    .limit(HISTORY_WINDOW)
    .then((docs) => docs.reverse());

  const geminiHistory = history.slice(0, -1).map((doc) => ({
    role: doc.role === "assistant" ? "model" : "user",
    parts: [{ text: doc.content }],
  }));

  let genAI;
  try {
    genAI = getGeminiClient();
  } catch (err) {
    yield { type: "error", message: (err as Error).message };
    return;
  }

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL_NAME,
    systemInstruction: SYSTEM_INSTRUCTION,
    tools: [{ functionDeclarations: toolDeclarations }],
  });

  const chat = model.startChat({ history: geminiHistory });
  const toolCallLog: IToolCallRecord[] = [];
  let replyText = "";

  try {
    let nextMessage: string | { functionResponse: { name: string; response: object } }[] = message;

    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration += 1) {
      const streamResult = await chat.sendMessageStream(nextMessage);
      let turnText = "";

      for await (const chunk of streamResult.stream) {
        const text = chunk.text();
        if (text) {
          turnText += text;
          yield { type: "text_delta", text };
        }
      }

      const aggregated = await streamResult.response;
      const calls = aggregated.functionCalls() ?? [];

      if (calls.length === 0) {
        replyText = turnText.trim();
        break;
      }

      const functionResponses: { functionResponse: { name: string; response: object } }[] = [];
      for (const call of calls) {
        const args = (call.args ?? {}) as Record<string, unknown>;
        yield { type: "tool_call", tool: call.name, args };
        const result = await executeTool(call.name, args);
        toolCallLog.push({ tool: call.name, args });
        yield { type: "tool_result", tool: call.name, result };
        functionResponses.push({
          functionResponse: { name: call.name, response: result as object },
        });
      }
      nextMessage = functionResponses;
    }
  } catch (err) {
    yield { type: "error", message: summarizeGeminiError(err) };
    return;
  }

  if (!replyText) {
    replyText =
      "I wasn't able to put together a full answer that time - could you rephrase or ask something more specific about your trip?";
  }

  await ChatMessage.create({
    user: userId,
    sessionId,
    role: "assistant",
    content: replyText,
    toolCalls: toolCallLog,
  });

  yield { type: "done", reply: replyText, suggestions: buildSuggestions(toolCallLog) };
}

export async function getChatHistory(userId: string, sessionId: string) {
  return ChatMessage.find({ user: userId, sessionId }).sort({ createdAt: 1 });
}
