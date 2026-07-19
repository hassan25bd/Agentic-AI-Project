import { Schema, model, Document, Types } from "mongoose";

export interface IItineraryDay {
  day: number;
  title: string;
  activities: string[];
  estimatedCost: number;
  tips: string;
}

export interface IItinerary extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  destination: string;
  days: number;
  budget: number;
  interests: string[];
  pace: "relaxed" | "balanced" | "packed";
  plan: IItineraryDay[];
  summary: string;
  createdAt: Date;
}

const itineraryDaySchema = new Schema<IItineraryDay>(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    activities: { type: [String], required: true },
    estimatedCost: { type: Number, required: true },
    tips: { type: String, default: "" },
  },
  { _id: false }
);

const itinerarySchema = new Schema<IItinerary>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    destination: { type: String, required: true },
    days: { type: Number, required: true },
    budget: { type: Number, required: true },
    interests: { type: [String], default: [] },
    pace: {
      type: String,
      enum: ["relaxed", "balanced", "packed"],
      default: "balanced",
    },
    plan: { type: [itineraryDaySchema], required: true },
    summary: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Itinerary = model<IItinerary>("Itinerary", itinerarySchema);
