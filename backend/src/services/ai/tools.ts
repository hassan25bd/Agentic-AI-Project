import { SchemaType, FunctionDeclaration } from "@google/generative-ai";
import { Types } from "mongoose";
import { Experience } from "../../models/Experience";

export const toolDeclarations: FunctionDeclaration[] = [
  {
    name: "search_experiences",
    description:
      "Search Voyager's catalog of travel experiences by keyword, category, location, and/or max price. Use this whenever the traveler asks for suggestions, availability, or pricing instead of guessing.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: {
          type: SchemaType.STRING,
          description: "Free-text keywords, e.g. 'hiking' or 'food tour'.",
        },
        category: {
          type: SchemaType.STRING,
          description:
            "One of: Adventure, Culture, Food & Drink, Nature, Relaxation, City Life.",
        },
        location: {
          type: SchemaType.STRING,
          description: "City or country name to filter by.",
        },
        maxPrice: {
          type: SchemaType.NUMBER,
          description: "Maximum price in USD.",
        },
      },
    },
  },
  {
    name: "get_experience_details",
    description:
      "Fetch full details (description, highlights, included items, rating) for one experience by its id. Use after search_experiences to answer follow-up questions about a specific listing.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        experienceId: { type: SchemaType.STRING },
      },
      required: ["experienceId"],
    },
  },
];

export async function executeTool(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "search_experiences": {
      const filter: Record<string, unknown> = {};
      if (args.query) filter.$text = { $search: String(args.query) };
      if (args.category) filter.category = args.category;
      if (args.maxPrice) filter.price = { $lte: Number(args.maxPrice) };
      if (args.location) {
        filter.$or = [
          { "location.city": new RegExp(String(args.location), "i") },
          { "location.country": new RegExp(String(args.location), "i") },
        ];
      }
      const results = await Experience.find(filter)
        .select("title shortDescription price rating location category durationDays")
        .limit(6);
      return {
        count: results.length,
        experiences: results.map((r) => ({
          id: r._id.toString(),
          title: r.title,
          shortDescription: r.shortDescription,
          price: r.price,
          rating: r.rating,
          location: r.location,
          category: r.category,
          durationDays: r.durationDays,
        })),
      };
    }
    case "get_experience_details": {
      const id = String(args.experienceId ?? "");
      if (!Types.ObjectId.isValid(id)) {
        return { error: "Invalid experience id." };
      }
      const experience = await Experience.findById(id);
      if (!experience) {
        return { error: "Experience not found." };
      }
      return {
        id: experience._id.toString(),
        title: experience.title,
        fullDescription: experience.fullDescription,
        highlights: experience.highlights,
        included: experience.included,
        price: experience.price,
        rating: experience.rating,
        reviewCount: experience.reviewCount,
        location: experience.location,
        durationDays: experience.durationDays,
      };
    }
    default:
      return { error: `Unknown tool: ${name}` };
  }
}
