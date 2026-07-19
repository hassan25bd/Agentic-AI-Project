import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";

export interface AuthedRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function requireAuth(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : req.cookies?.token;

  if (!token) {
    next(new ApiError(401, "Authentication required."));
    return;
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired session."));
  }
}

export function optionalAuth(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : req.cookies?.token;
  if (token) {
    try {
      const payload = verifyToken(token);
      req.userId = payload.sub;
      req.userRole = payload.role;
    } catch {
      // ignore invalid token for optional auth
    }
  }
  next();
}
