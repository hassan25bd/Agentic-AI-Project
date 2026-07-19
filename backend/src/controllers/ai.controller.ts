import { z } from "zod";
import { catchAsync } from "../utils/catchAsync";
import { AuthedRequest } from "../middleware/auth";
import { generateItinerary, listItinerariesForUser } from "../services/ai/itinerary.service";
import { generateRecommendations } from "../services/ai/recommendation.service";
import { runChatAgent, getChatHistory } from "../services/ai/chat.agent";

export const itinerarySchema = z.object({
  destination: z.string().min(2).max(100),
  days: z.number().int().min(1).max(14),
  budget: z.number().min(50),
  interests: z.array(z.string()).default([]),
  pace: z.enum(["relaxed", "balanced", "packed"]).default("balanced"),
  regenerate: z.boolean().optional(),
});

export const chatMessageSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1).max(2000),
});

export const createItinerary = catchAsync(async (req: AuthedRequest, res) => {
  const data = req.body as z.infer<typeof itinerarySchema>;
  const itinerary = await generateItinerary({ userId: req.userId!, ...data });
  res.status(201).json({ itinerary });
});

export const myItineraries = catchAsync(async (req: AuthedRequest, res) => {
  const itineraries = await listItinerariesForUser(req.userId!);
  res.json({ itineraries });
});

export const recommendations = catchAsync(async (req: AuthedRequest, res) => {
  const { category, maxPrice, location } = req.query as Record<string, string>;
  const result = await generateRecommendations(req.userId!, {
    category: category || undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    location: location || undefined,
  });
  res.json(result);
});

export const chatOnce = catchAsync(async (req: AuthedRequest, res) => {
  const { sessionId, message } = req.body as z.infer<typeof chatMessageSchema>;
  let reply = "";
  let suggestions: string[] = [];
  const toolCalls: { tool: string; result: unknown }[] = [];

  for await (const event of runChatAgent(req.userId!, sessionId, message)) {
    if (event.type === "done") {
      reply = event.reply;
      suggestions = event.suggestions;
    }
    if (event.type === "tool_result") {
      toolCalls.push({ tool: event.tool, result: event.result });
    }
    if (event.type === "error") {
      res.status(502).json({ message: event.message });
      return;
    }
  }

  res.json({ reply, suggestions, toolCalls });
});

export const chatStream = catchAsync(async (req: AuthedRequest, res) => {
  const { sessionId, message } = req.body as z.infer<typeof chatMessageSchema>;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    for await (const event of runChatAgent(req.userId!, sessionId, message)) {
      send(event.type, event);
    }
  } catch (err) {
    send("error", { message: (err as Error).message });
  } finally {
    res.end();
  }
});

export const chatHistory = catchAsync(async (req: AuthedRequest, res) => {
  const { sessionId } = req.params;
  const messages = await getChatHistory(req.userId!, sessionId);
  res.json({ messages });
});
