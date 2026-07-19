export type ExperienceCategory =
  | "Adventure"
  | "Culture"
  | "Food & Drink"
  | "Nature"
  | "Relaxation"
  | "City Life";

export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  "Adventure",
  "Culture",
  "Food & Drink",
  "Nature",
  "Relaxation",
  "City Life",
];

export interface HostSummary {
  _id: string;
  name: string;
  avatarUrl: string;
}

export interface Experience {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  price: number;
  currency: string;
  location: { city: string; country: string };
  category: ExperienceCategory;
  durationDays: number;
  availableFrom: string;
  tags: string[];
  highlights: string[];
  included: string[];
  rating: number;
  reviewCount: number;
  host: HostSummary | string;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceListResponse {
  items: Experience[];
  total: number;
  page: number;
  pages: number;
}

export interface Review {
  _id: string;
  experience: string;
  user: { _id: string; name: string; avatarUrl: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ExperienceDetailResponse {
  experience: Experience;
  reviews: Review[];
  related: Pick<
    Experience,
    | "_id"
    | "title"
    | "shortDescription"
    | "images"
    | "price"
    | "rating"
    | "location"
    | "durationDays"
  >[];
}

export type BudgetLevel = "budget" | "mid-range" | "luxury";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: "traveler" | "host" | "admin";
  interests: string[];
  budgetLevel: BudgetLevel;
  travelStyle: string[];
  savedExperiences: string[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  estimatedCost: number;
  tips: string;
}

export interface Itinerary {
  _id: string;
  user: string;
  destination: string;
  days: number;
  budget: number;
  interests: string[];
  pace: "relaxed" | "balanced" | "packed";
  plan: ItineraryDay[];
  summary: string;
  createdAt: string;
}

export interface Recommendation {
  experience: Experience;
  reason: string;
}

export interface ChatEventDone {
  type: "done";
  reply: string;
  suggestions: string[];
}
export interface ChatEventToolCall {
  type: "tool_call";
  tool: string;
  args: Record<string, unknown>;
}
export interface ChatEventToolResult {
  type: "tool_result";
  tool: string;
  result: unknown;
}
export interface ChatEventTextDelta {
  type: "text_delta";
  text: string;
}
export interface ChatEventError {
  type: "error";
  message: string;
}
export type ChatEvent =
  | ChatEventDone
  | ChatEventToolCall
  | ChatEventToolResult
  | ChatEventTextDelta
  | ChatEventError;
