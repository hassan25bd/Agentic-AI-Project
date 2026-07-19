import { Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User";
import { env } from "../config/env";
import { signToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { catchAsync } from "../utils/catchAsync";
import { AuthedRequest } from "../middleware/auth";

const googleClient = new OAuth2Client(env.googleClientId);

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const googleLoginSchema = z.object({
  credential: z.string().min(10),
});

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? ("none" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function publicUser(user: {
  _id: unknown;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  interests: string[];
  budgetLevel: string;
  travelStyle: string[];
  savedExperiences: unknown[];
}) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    interests: user.interests,
    budgetLevel: user.budgetLevel,
    travelStyle: user.travelStyle,
    savedExperiences: user.savedExperiences,
  };
}

function issueSession(res: Response, id: string, role: string) {
  const token = signToken({ sub: id, role });
  res.cookie("token", token, COOKIE_OPTIONS);
  return token;
}

export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body as z.infer<typeof registerSchema>;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, provider: "local" });

  const token = issueSession(res, user.id, user.role);
  res.status(201).json({ token, user: publicUser(user) });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body as z.infer<typeof loginSchema>;

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !user.passwordHash) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = issueSession(res, user.id, user.role);
  res.json({ token, user: publicUser(user) });
});

export const googleLogin = catchAsync(async (req, res) => {
  const { credential } = req.body as z.infer<typeof googleLoginSchema>;

  if (!env.googleClientId) {
    throw new ApiError(500, "Google login is not configured on the server.");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId,
  });
  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new ApiError(401, "Could not verify Google account.");
  }

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = await User.create({
      name: payload.name ?? payload.email.split("@")[0],
      email: payload.email,
      avatarUrl: payload.picture ?? undefined,
      provider: "google",
      googleId: payload.sub,
    });
  }

  const token = issueSession(res, user.id, user.role);
  res.json({ token, user: publicUser(user) });
});

export const logout = catchAsync(async (_req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.status(204).send();
});

export const me = catchAsync(async (req: AuthedRequest, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  res.json({ user: publicUser(user) });
});
