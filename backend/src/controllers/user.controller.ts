import { z } from "zod";
import { User } from "../models/User";
import { catchAsync } from "../utils/catchAsync";
import { AuthedRequest } from "../middleware/auth";
import { ApiError } from "../utils/ApiError";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  interests: z.array(z.string()).optional(),
  budgetLevel: z.enum(["budget", "mid-range", "luxury"]).optional(),
  travelStyle: z.array(z.string()).optional(),
});

export const updateProfile = catchAsync(async (req: AuthedRequest, res) => {
  const data = req.body as z.infer<typeof updateProfileSchema>;
  const user = await User.findByIdAndUpdate(req.userId, data, { new: true });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      interests: user.interests,
      budgetLevel: user.budgetLevel,
      travelStyle: user.travelStyle,
      savedExperiences: user.savedExperiences,
    },
  });
});

export const savedExperiences = catchAsync(async (req: AuthedRequest, res) => {
  const user = await User.findById(req.userId).populate({
    path: "savedExperiences",
    select: "title shortDescription images price rating location durationDays category",
  });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  res.json({ items: user.savedExperiences });
});
