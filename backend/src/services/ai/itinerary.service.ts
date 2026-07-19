import { SchemaType } from "@google/generative-ai";
import { getGeminiClient, GEMINI_MODEL_NAME, summarizeGeminiError } from "./gemini.client";
import { Itinerary, IItineraryDay } from "../../models/Itinerary";
import { ApiError } from "../../utils/ApiError";

export interface GenerateItineraryInput {
  userId: string;
  destination: string;
  days: number;
  budget: number;
  interests: string[];
  pace: "relaxed" | "balanced" | "packed";
  regenerate?: boolean;
}

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: {
      type: SchemaType.STRING,
      description: "A 2-3 sentence overview of the trip and how it fits the traveler's goals.",
    },
    plan: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          day: { type: SchemaType.NUMBER },
          title: { type: SchemaType.STRING },
          activities: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          estimatedCost: { type: SchemaType.NUMBER },
          tips: { type: SchemaType.STRING },
        },
        required: ["day", "title", "activities", "estimatedCost", "tips"],
      },
    },
  },
  required: ["summary", "plan"],
};

function buildPrompt(input: GenerateItineraryInput): string {
  const interestsText = input.interests.length
    ? input.interests.join(", ")
    : "general sightseeing";

  return `You are Voyager's trip-planning agent. Reason step by step about logistics (travel time between activities, opening hours, pacing, budget allocation) before producing the final plan, but ONLY output the final structured JSON result.

Traveler request:
- Destination: ${input.destination}
- Trip length: ${input.days} day(s)
- Total budget: $${input.budget} USD
- Interests: ${interestsText}
- Preferred pace: ${input.pace} (relaxed = 1-2 activities/day, balanced = 2-3, packed = 4+)

Requirements:
- Produce exactly ${input.days} day entries, numbered sequentially starting at 1.
- Each day needs a short descriptive title, 2-5 concrete activities (specific places/actions, not generic advice), an estimated cost in USD for that day, and one practical tip.
- The sum of estimatedCost across days should stay reasonably within the total budget.
- Ground activities in real, plausible attractions/neighborhoods/cuisine for the destination.
- Do not include any commentary outside the JSON structure.`;
}

export async function generateItinerary(input: GenerateItineraryInput) {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
      temperature: input.regenerate ? 0.9 : 0.7,
    },
  });

  const prompt = buildPrompt(input);

  let parsed: { summary: string; plan: IItineraryDay[] };
  try {
    const result = await model.generateContent(prompt);
    parsed = JSON.parse(result.response.text());
  } catch (err) {
    throw new ApiError(502, summarizeGeminiError(err));
  }

  const itinerary = await Itinerary.create({
    user: input.userId,
    destination: input.destination,
    days: input.days,
    budget: input.budget,
    interests: input.interests,
    pace: input.pace,
    plan: parsed.plan,
    summary: parsed.summary,
  });

  return itinerary;
}

export async function listItinerariesForUser(userId: string) {
  return Itinerary.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
}
