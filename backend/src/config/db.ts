import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB(): Promise<void> {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(env.mongodbUri);
    console.log(`[db] connected -> ${mongoose.connection.name}`);
  } catch (err) {
    console.error("[db] connection failed:", (err as Error).message);
    console.error(
      "[db] set MONGODB_URI in backend/.env to a running MongoDB instance (local or Atlas) and restart."
    );
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("[db] disconnected");
});
