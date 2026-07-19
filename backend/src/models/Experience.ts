import { Schema, model, Document, Types } from "mongoose";

export const EXPERIENCE_CATEGORIES = [
  "Adventure",
  "Culture",
  "Food & Drink",
  "Nature",
  "Relaxation",
  "City Life",
] as const;

export type ExperienceCategory = (typeof EXPERIENCE_CATEGORIES)[number];

export interface IExperience extends Document {
  _id: Types.ObjectId;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  price: number;
  currency: string;
  location: { city: string; country: string };
  category: ExperienceCategory;
  durationDays: number;
  availableFrom: Date;
  tags: string[];
  highlights: string[];
  included: string[];
  rating: number;
  reviewCount: number;
  host: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    shortDescription: { type: String, required: true, maxlength: 220 },
    fullDescription: { type: String, required: true },
    images: {
      type: [String],
      validate: (arr: string[]) => arr.length > 0,
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    location: {
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    category: { type: String, enum: EXPERIENCE_CATEGORIES, required: true },
    durationDays: { type: Number, required: true, min: 1 },
    availableFrom: { type: Date, required: true },
    tags: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    included: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

experienceSchema.index({
  title: "text",
  shortDescription: "text",
  tags: "text",
  "location.city": "text",
  "location.country": "text",
});

export const Experience = model<IExperience>("Experience", experienceSchema);
