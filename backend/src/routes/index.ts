import { Router } from "express";
import authRoutes from "./auth.routes";
import experienceRoutes from "./experience.routes";
import aiRoutes from "./ai.routes";
import subscriberRoutes from "./subscriber.routes";
import userRoutes from "./user.routes";
import contactRoutes from "./contact.routes";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));
router.use("/auth", authRoutes);
router.use("/experiences", experienceRoutes);
router.use("/ai", aiRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/users", userRoutes);
router.use("/contact", contactRoutes);

export default router;
