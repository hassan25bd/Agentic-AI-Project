import { Router } from "express";
import { z } from "zod";
import { ContactMessage } from "../models/ContactMessage";
import { validateBody } from "../middleware/validate";
import { catchAsync } from "../utils/catchAsync";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(150),
  message: z.string().min(10).max(3000),
});

router.post(
  "/",
  validateBody(contactSchema),
  catchAsync(async (req, res) => {
    const data = req.body as z.infer<typeof contactSchema>;
    await ContactMessage.create(data);
    res.status(201).json({ message: "Message received." });
  })
);

export default router;
