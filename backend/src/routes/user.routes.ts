import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { updateProfile, savedExperiences, updateProfileSchema } from "../controllers/user.controller";

const router = Router();

router.use(requireAuth);
router.patch("/me", validateBody(updateProfileSchema), updateProfile);
router.get("/me/saved", savedExperiences);

export default router;
