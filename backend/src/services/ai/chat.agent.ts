import { Content } from "@google/generative-ai";
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunkText(text: string): string[] {
  return text.match(/\S+\s*/g) ?? (text ? [text] : []);
}

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

  const geminiHistory: Content[] = history.slice(0, -1).map((doc) => ({
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

  // Contents are managed manually (rather than via model.startChat()) so that the raw
  // model turn - including the thought_signature Gemini's newer "thinking" models attach
  // to function-call parts - is replayed back verbatim on the next turn. The SDK's own
  // ChatSession history bookkeeping predates that requirement and drops it, which the API
  // then rejects on multi-turn tool calls.
  const contents: Content[] = [
    ...geminiHistory,
    { role: "user", parts: [{ text: message }] },
  ];

  const toolCallLog: IToolCallRecord[] = [];
  let replyText = "";

  try {
    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration += 1) {
      // Non-streaming on purpose: the SDK's chunk-merging for generateContentStream()
      // predates "thinking" models and silently drops thoughtSignature while reassembling
      // a functionCall split across stream chunks, which the API then rejects on the next
      // turn. A single generateContent() response has no merge step, so the field survives.
      const result = await model.generateContent({ contents });
      const response = result.response;
      const modelContent = response.candidates?.[0]?.content;
      const calls = response.functionCalls() ?? [];

      if (calls.length === 0) {
        const finalText = response.text().trim();
        for (const chunk of chunkText(finalText)) {
          yield { type: "text_delta", text: chunk };
          await sleep(12);
        }
        replyText = finalText;
        break;
      }

      if (modelContent) {
        contents.push(modelContent);
      }

      const functionResponseParts = [];
      for (const call of calls) {
        const args = (call.args ?? {}) as Record<string, unknown>;
        yield { type: "tool_call", tool: call.name, args };
        const result = await executeTool(call.name, args);
        toolCallLog.push({ tool: call.name, args });
        yield { type: "tool_result", tool: call.name, result };
        functionResponseParts.push({
          functionResponse: { name: call.name, response: result as object },
        });
      }
      contents.push({ role: "user", parts: functionResponseParts });
    }
    if (!replyText) {
      // Exhausted MAX_TOOL_ITERATIONS without the model settling on a final answer (can
      // happen on vague prompts that keep inviting another tool call). Force one last
      // text-only pass over whatever tool results are already in `contents` rather than
      // showing the user a canned "couldn't answer" message.
      const finalModel = genAI.getGenerativeModel({
        model: GEMINI_MODEL_NAME,
        systemInstruction: SYSTEM_INSTRUCTION,
      });
      const forced = await finalModel.generateContent({ contents });
      const forcedText = forced.response.text().trim();
      for (const chunk of chunkText(forcedText)) {
        yield { type: "text_delta", text: chunk };
        await sleep(12);
      }
      replyText = forcedText;
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
