import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err && typeof err === "object" && "code" in err && (err as { code: number }).code === 11000) {
    res.status(409).json({ message: "A record with these details already exists." });
    return;
  }

  console.error("[error]", err);
  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : message });
}
