import { Schema, model, Document } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, maxlength: 150 },
    message: { type: String, required: true, maxlength: 3000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ContactMessage = model<IContactMessage>("ContactMessage", contactMessageSchema);
