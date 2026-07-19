import { Router } from "express";
import { z } from "zod";
import { Subscriber } from "../models/Subscriber";
import { validateBody } from "../middleware/validate";
import { catchAsync } from "../utils/catchAsync";
import { ApiError } from "../utils/ApiError";

const router = Router();

const subscribeSchema = z.object({ email: z.string().email() });

router.post(
  "/",
  validateBody(subscribeSchema),
  catchAsync(async (req, res) => {
    const { email } = req.body as z.infer<typeof subscribeSchema>;
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      throw new ApiError(409, "This email is already subscribed.");
    }
    await Subscriber.create({ email });
    res.status(201).json({ message: "Subscribed." });
  })
);

export default router;
