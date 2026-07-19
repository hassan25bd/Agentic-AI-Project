import { Router } from "express";
import {
  register,
  login,
  googleLogin,
  logout,
  me,
  registerSchema,
  loginSchema,
  googleLoginSchema,
} from "../controllers/auth.controller";
import { validateBody } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/google", validateBody(googleLoginSchema), googleLogin);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
