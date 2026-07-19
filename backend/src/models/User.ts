import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  avatarUrl: string;
  provider: "local" | "google";
  googleId?: string;
  role: "traveler" | "host" | "admin";
  interests: string[];
  budgetLevel: "budget" | "mid-range" | "luxury";
  travelStyle: string[];
  savedExperiences: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, select: false },
    avatarUrl: {
      type: String,
      default: "https://api.dicebear.com/9.x/notionists/svg?seed=voyager",
    },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String },
    role: {
      type: String,
      enum: ["traveler", "host", "admin"],
      default: "traveler",
    },
    interests: { type: [String], default: [] },
    budgetLevel: {
      type: String,
      enum: ["budget", "mid-range", "luxury"],
      default: "mid-range",
    },
    travelStyle: { type: [String], default: [] },
    savedExperiences: [{ type: Schema.Types.ObjectId, ref: "Experience" }],
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
