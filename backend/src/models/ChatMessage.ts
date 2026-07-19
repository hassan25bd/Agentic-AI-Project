import { Schema, model, Document, Types } from "mongoose";

export interface IToolCallRecord {
  tool: string;
  args: Record<string, unknown>;
}

export interface IChatMessage extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  toolCalls: IToolCallRecord[];
  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true, index: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    toolCalls: {
      type: [
        new Schema<IToolCallRecord>(
          {
            tool: { type: String, required: true },
            args: { type: Schema.Types.Mixed, default: {} },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ChatMessage = model<IChatMessage>(
  "ChatMessage",
  chatMessageSchema
);
