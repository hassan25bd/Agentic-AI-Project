import { IncomingMessage, ServerResponse } from "http";
import mongoose from "mongoose";
import app from "../src/app";
import { connectDB } from "../src/config/db";

let connecting: Promise<void> | null = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (mongoose.connection.readyState !== 1) {
    if (!connecting) {
      connecting = connectDB();
    }
    await connecting;
  }
  return (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(req, res);
}
