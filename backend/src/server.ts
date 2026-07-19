import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

async function start() {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`[server] Voyager API listening on http://localhost:${env.port}`);
  });
}

start();
