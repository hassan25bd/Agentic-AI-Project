import bcrypt from "bcryptjs";
import { connectDB } from "../config/db";
import { env } from "../config/env";
import { User } from "../models/User";
import { Experience } from "../models/Experience";
import { Review } from "../models/Review";
import { Itinerary } from "../models/Itinerary";
import { ChatMessage } from "../models/ChatMessage";
import { Subscriber } from "../models/Subscriber";
import { seedExperiences } from "./data/experiences";
import { seedExperiencesBatch2 } from "./data/experiencesBatch2";
import mongoose from "mongoose";

const HOSTS = [
  {
    email: "priya.host@voyager.app",
    name: "Priya Nair",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=priya-nair",
  },
  {
    email: "diego.host@voyager.app",
    name: "Diego Fernandez",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=diego-fernandez",
  },
  {
    email: "amara.host@voyager.app",
    name: "Amara Osei",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=amara-osei",
  },
  {
    email: "marco.host@voyager.app",
    name: "Marco Rossi",
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=marco-rossi",
  },
];

const REVIEWERS = [
  { email: "grace.lin@example.com", name: "Grace Lin" },
  { email: "tom.becker@example.com", name: "Tom Becker" },
  { email: "sofia.alvarez@example.com", name: "Sofia Alvarez" },
  { email: "noah.kim@example.com", name: "Noah Kim" },
  { email: "yuki.tanaka@example.com", name: "Yuki Tanaka" },
];

const REVIEW_TEMPLATES = [
  { rating: 5, comment: "Exceeded expectations - the guide's local knowledge made this unforgettable. Worth every dollar." },
  { rating: 5, comment: "One of the best travel experiences I've booked. Small group, well organized, no wasted time." },
  { rating: 4, comment: "Really enjoyable and well run. Docked one star only because the pace felt a bit rushed near the end." },
  { rating: 5, comment: "Our guide's stories and context turned this from a photo stop into something I actually understood." },
  { rating: 4, comment: "Great value and a genuinely knowledgeable host. Would book again on a future trip." },
  { rating: 5, comment: "Booked this on a whim and it ended up being the highlight of the whole trip." },
];

async function seed() {
  await connectDB();
  console.log("[seed] connected, clearing existing demo data...");

  await Promise.all([
    Review.deleteMany({}),
    Experience.deleteMany({}),
    Itinerary.deleteMany({}),
    ChatMessage.deleteMany({}),
    Subscriber.deleteMany({}),
    User.deleteMany({ email: { $ne: undefined } }),
  ]);

  const passwordHash = await bcrypt.hash("VoyagerHost123!", 12);

  const hostDocs = await User.insertMany(
    HOSTS.map((h) => ({
      name: h.name,
      email: h.email,
      passwordHash,
      avatarUrl: h.avatarUrl,
      provider: "local",
      role: "host",
      interests: [],
      budgetLevel: "mid-range",
    }))
  );
  const hostByEmail = new Map(hostDocs.map((h) => [h.email, h._id]));

  const reviewerPasswordHash = await bcrypt.hash("VoyagerTraveler123!", 12);
  const reviewerDocs = await User.insertMany(
    REVIEWERS.map((r) => ({
      name: r.name,
      email: r.email,
      passwordHash: reviewerPasswordHash,
      avatarUrl: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(r.name)}`,
      provider: "local",
      role: "traveler",
      interests: ["Culture", "Nature", "Food & Drink"].sort(() => Math.random() - 0.5).slice(0, 2),
      budgetLevel: (["budget", "mid-range", "luxury"] as const)[Math.floor(Math.random() * 3)],
    }))
  );

  const demoPasswordHash = await bcrypt.hash(env.demoUserPassword, 12);
  const demoUser = await User.create({
    name: "Alex Rivera",
    email: env.demoUserEmail,
    passwordHash: demoPasswordHash,
    avatarUrl: "https://api.dicebear.com/9.x/notionists/svg?seed=alex-rivera",
    provider: "local",
    role: "traveler",
    interests: ["Culture", "Food & Drink", "Nature"],
    budgetLevel: "mid-range",
    travelStyle: ["slow travel", "small group", "photography"],
  });

  console.log(`[seed] created ${hostDocs.length} hosts, ${reviewerDocs.length} reviewers, 1 demo user`);

  const allSeedExperiences = [...seedExperiences, ...seedExperiencesBatch2];

  const experienceDocs = await Experience.insertMany(
    allSeedExperiences.map((exp) => ({
      title: exp.title,
      shortDescription: exp.shortDescription,
      fullDescription: exp.fullDescription,
      images: exp.images,
      price: exp.price,
      currency: exp.currency,
      location: exp.location,
      category: exp.category,
      durationDays: exp.durationDays,
      availableFrom: new Date(exp.availableFrom),
      tags: exp.tags,
      highlights: exp.highlights,
      included: exp.included,
      host: hostByEmail.get(exp.hostEmail),
    }))
  );
  console.log(`[seed] created ${experienceDocs.length} experiences`);

  const allReviewers = [...reviewerDocs, demoUser];
  let reviewCount = 0;
  for (const experience of experienceDocs) {
    const numReviews = 2 + Math.floor(Math.random() * 3);
    const shuffled = [...allReviewers].sort(() => Math.random() - 0.5).slice(0, numReviews);
    const templates = [...REVIEW_TEMPLATES].sort(() => Math.random() - 0.5).slice(0, numReviews);

    for (let i = 0; i < shuffled.length; i += 1) {
      await Review.create({
        experience: experience._id,
        user: shuffled[i]._id,
        rating: templates[i].rating,
        comment: templates[i].comment,
      });
      reviewCount += 1;
    }

    const agg = await Review.aggregate([
      { $match: { experience: experience._id } },
      { $group: { _id: "$experience", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    experience.rating = Math.round((agg[0]?.avg ?? 0) * 10) / 10;
    experience.reviewCount = agg[0]?.count ?? 0;
    await experience.save();
  }
  console.log(`[seed] created ${reviewCount} reviews and recomputed ratings`);

  demoUser.savedExperiences = experienceDocs.slice(0, 3).map((e) => e._id);
  await demoUser.save();

  console.log("[seed] done.");
  console.log(`[seed] demo login -> email: ${env.demoUserEmail} / password: ${env.demoUserPassword}`);
  console.log(`[seed] host login (any host) -> password: VoyagerHost123!`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
