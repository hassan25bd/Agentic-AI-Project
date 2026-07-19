import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env";
import { ApiError } from "../../utils/ApiError";

let client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!env.geminiApiKey) {
    throw new ApiError(
      503,
      "AI features are not configured. Set GEMINI_API_KEY in backend/.env to enable them."
    );
  }
  if (!client) {
    client = new GoogleGenerativeAI(env.geminiApiKey);
  }
  return client;
}

export const GEMINI_MODEL_NAME = env.geminiModel;

export function summarizeGeminiError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (/API_KEY_INVALID|API key not valid/i.test(message)) {
    return "The server's Gemini API key is missing or invalid. Set a valid GEMINI_API_KEY in backend/.env.";
  }
  if (/429|quota|rate.?limit/i.test(message)) {
    return "The AI provider is rate-limiting requests right now. Please try again shortly.";
  }
  console.error("[gemini] request failed:", message);
  return "The AI provider returned an unexpected error. Please try again.";
}
