import { Router } from "express";
import {
  listExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  myExperiences,
  toggleSaveExperience,
  addReview,
  experienceSchema,
  reviewSchema,
} from "../controllers/experience.controller";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";

const router = Router();

router.get("/", listExperiences);
router.get("/mine", requireAuth, myExperiences);
router.get("/:id", getExperience);
router.post("/", requireAuth, validateBody(experienceSchema), createExperience);
router.patch("/:id", requireAuth, updateExperience);
router.delete("/:id", requireAuth, deleteExperience);
router.post("/:id/save", requireAuth, toggleSaveExperience);
router.post("/:id/reviews", requireAuth, validateBody(reviewSchema), addReview);

export default router;
