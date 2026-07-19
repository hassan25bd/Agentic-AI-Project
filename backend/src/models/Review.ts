import { Schema, model, Document, Types } from "mongoose";

export interface IReview extends Document {
  _id: Types.ObjectId;
  experience: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    experience: {
      type: Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

reviewSchema.index({ experience: 1, user: 1 }, { unique: true });

export const Review = model<IReview>("Review", reviewSchema);
