import { SchemaType } from "@google/generative-ai";
import { getGeminiClient, GEMINI_MODEL_NAME, summarizeGeminiError } from "./gemini.client";
import { Experience } from "../../models/Experience";
import { Review } from "../../models/Review";
import { User } from "../../models/User";
import { ApiError } from "../../utils/ApiError";

export interface RecommendationRefinement {
  category?: string;
  maxPrice?: number;
  location?: string;
}

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    recommendations: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          experienceId: { type: SchemaType.STRING },
          reason: {
            type: SchemaType.STRING,
            description: "One sentence, personalized to this traveler, explaining why this fits them.",
          },
        },
        required: ["experienceId", "reason"],
      },
    },
  },
  required: ["recommendations"],
};

export async function generateRecommendations(
  userId: string,
  refinement: RecommendationRefinement = {}
) {
  const user = await User.findById(userId).populate("savedExperiences", "title category tags location");
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const myReviews = await Review.find({ user: userId }).populate(
    "experience",
    "title category"
  );

  const candidateFilter: Record<string, unknown> = {
    _id: { $nin: user.savedExperiences.map((e) => e._id) },
  };
  if (refinement.category) candidateFilter.category = refinement.category;
  if (refinement.maxPrice) candidateFilter.price = { $lte: refinement.maxPrice };
  if (refinement.location) {
    candidateFilter.$or = [
      { "location.city": new RegExp(refinement.location, "i") },
      { "location.country": new RegExp(refinement.location, "i") },
    ];
  }

  const candidates = await Experience.find(candidateFilter)
    .select("title shortDescription category price rating reviewCount location tags durationDays images")
    .limit(40);

  if (candidates.length === 0) {
    return { recommendations: [] };
  }

  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.6,
    },
  });

  const profile = {
    interests: user.interests,
    budgetLevel: user.budgetLevel,
    travelStyle: user.travelStyle,
    savedExperiences: user.savedExperiences.map((e) => ({
      title: (e as unknown as { title: string }).title,
      category: (e as unknown as { category: string }).category,
    })),
    pastReviews: myReviews.map((r) => ({
      experience: (r.experience as unknown as { title: string })?.title,
      rating: r.rating,
    })),
  };

  const prompt = `You are Voyager's recommendation agent. Analyze this traveler's profile and behavior, then select the best-fitting experiences from the candidate list below.

Traveler profile (JSON): ${JSON.stringify(profile)}

Refinement filters requested by the traveler right now: ${JSON.stringify(refinement)}

Candidate experiences (JSON array, "id" is the database id you must return verbatim):
${JSON.stringify(
  candidates.map((c) => ({
    id: c._id.toString(),
    title: c.title,
    category: c.category,
    price: c.price,
    rating: c.rating,
    location: c.location,
    tags: c.tags,
    durationDays: c.durationDays,
  }))
)}

Select the 6 best matches (fewer if the pool is small). Weigh: stated interests and travel style, budget level vs price, categories/tags similar to saved experiences and highly-rated past reviews, and any refinement filters. Order from best to worst match. Return only experienceId values that exist in the candidate list.`;

  let parsed: { recommendations: { experienceId: string; reason: string }[] };
  try {
    const result = await model.generateContent(prompt);
    parsed = JSON.parse(result.response.text());
  } catch (err) {
    throw new ApiError(502, summarizeGeminiError(err));
  }

  const byId = new Map(candidates.map((c) => [c._id.toString(), c]));
  const recommendations = parsed.recommendations
    .filter((r) => byId.has(r.experienceId))
    .map((r) => ({ experience: byId.get(r.experienceId), reason: r.reason }));

  return { recommendations };
}
