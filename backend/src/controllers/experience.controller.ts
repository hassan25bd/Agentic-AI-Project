import { z } from "zod";
import { Types } from "mongoose";
import { Experience, EXPERIENCE_CATEGORIES } from "../models/Experience";
import { Review } from "../models/Review";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { catchAsync } from "../utils/catchAsync";
import { AuthedRequest } from "../middleware/auth";

export const experienceSchema = z.object({
  title: z.string().min(4).max(120),
  shortDescription: z.string().min(10).max(220),
  fullDescription: z.string().min(30),
  images: z.array(z.string().url()).min(1),
  price: z.number().min(0),
  currency: z.string().default("USD"),
  location: z.object({ city: z.string().min(1), country: z.string().min(1) }),
  category: z.enum(EXPERIENCE_CATEGORIES),
  durationDays: z.number().int().min(1),
  availableFrom: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  included: z.array(z.string()).default([]),
});

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating_desc: { rating: -1 },
  duration_asc: { durationDays: 1 },
};

export const listExperiences = catchAsync(async (req, res) => {
  const {
    search,
    category,
    location,
    minPrice,
    maxPrice,
    minRating,
    sort = "newest",
    page = "1",
    limit = "8",
  } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$text = { $search: search };
  }
  if (category) {
    filter.category = category;
  }
  if (location) {
    filter.$or = [
      { "location.city": new RegExp(location, "i") },
      { "location.country": new RegExp(location, "i") },
    ];
  }
  if (minPrice || maxPrice) {
    filter.price = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
    };
  }
  if (minRating) {
    filter.rating = { $gte: Number(minRating) };
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(24, Math.max(1, Number(limit) || 8));
  const sortSpec = SORT_MAP[sort] ?? SORT_MAP.newest;

  const [items, total] = await Promise.all([
    Experience.find(filter)
      .sort(sortSpec)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("host", "name avatarUrl"),
    Experience.countDocuments(filter),
  ]);

  res.json({
    items,
    total,
    page: pageNum,
    pages: Math.max(1, Math.ceil(total / limitNum)),
  });
});

export const getExperience = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(404, "Experience not found.");
  }

  const experience = await Experience.findById(id).populate(
    "host",
    "name avatarUrl"
  );
  if (!experience) {
    throw new ApiError(404, "Experience not found.");
  }

  const [reviews, related] = await Promise.all([
    Review.find({ experience: id })
      .populate("user", "name avatarUrl")
      .sort({ createdAt: -1 })
      .limit(20),
    Experience.find({ category: experience.category, _id: { $ne: id } })
      .limit(4)
      .select("title shortDescription images price rating location durationDays"),
  ]);

  res.json({ experience, reviews, related });
});

export const createExperience = catchAsync(async (req: AuthedRequest, res) => {
  const data = req.body as z.infer<typeof experienceSchema>;
  const experience = await Experience.create({ ...data, host: req.userId });
  res.status(201).json({ experience });
});

export const updateExperience = catchAsync(async (req: AuthedRequest, res) => {
  const { id } = req.params;
  const experience = await Experience.findById(id);
  if (!experience) {
    throw new ApiError(404, "Experience not found.");
  }
  if (experience.host.toString() !== req.userId) {
    throw new ApiError(403, "You can only edit your own listings.");
  }

  const data = experienceSchema.partial().parse(req.body);
  Object.assign(experience, data);
  await experience.save();
  res.json({ experience });
});

export const deleteExperience = catchAsync(async (req: AuthedRequest, res) => {
  const { id } = req.params;
  const experience = await Experience.findById(id);
  if (!experience) {
    throw new ApiError(404, "Experience not found.");
  }
  if (experience.host.toString() !== req.userId) {
    throw new ApiError(403, "You can only delete your own listings.");
  }
  await experience.deleteOne();
  await Review.deleteMany({ experience: id });
  res.status(204).send();
});

export const myExperiences = catchAsync(async (req: AuthedRequest, res) => {
  const items = await Experience.find({ host: req.userId }).sort({
    createdAt: -1,
  });
  res.json({ items });
});

export const toggleSaveExperience = catchAsync(async (req: AuthedRequest, res) => {
  const { id } = req.params;
  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const idx = user.savedExperiences.findIndex((e) => e.toString() === id);
  let saved: boolean;
  if (idx >= 0) {
    user.savedExperiences.splice(idx, 1);
    saved = false;
  } else {
    user.savedExperiences.push(new Types.ObjectId(id));
    saved = true;
  }
  await user.save();
  res.json({ saved, savedExperiences: user.savedExperiences });
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(1000),
});

export const addReview = catchAsync(async (req: AuthedRequest, res) => {
  const { id } = req.params;
  const experience = await Experience.findById(id);
  if (!experience) {
    throw new ApiError(404, "Experience not found.");
  }

  const data = req.body as z.infer<typeof reviewSchema>;
  const existing = await Review.findOne({ experience: id, user: req.userId });
  if (existing) {
    throw new ApiError(409, "You have already reviewed this experience.");
  }

  const review = await Review.create({
    experience: id,
    user: req.userId,
    ...data,
  });

  const agg = await Review.aggregate([
    { $match: { experience: experience._id } },
    { $group: { _id: "$experience", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  experience.rating = agg[0]?.avg ?? data.rating;
  experience.reviewCount = agg[0]?.count ?? 1;
  await experience.save();

  const populated = await review.populate("user", "name avatarUrl");
  res.status(201).json({ review: populated, rating: experience.rating, reviewCount: experience.reviewCount });
});
