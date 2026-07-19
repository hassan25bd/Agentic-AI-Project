import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import {
  createItinerary,
  myItineraries,
  recommendations,
  chatOnce,
  chatStream,
  chatHistory,
  itinerarySchema,
  chatMessageSchema,
} from "../controllers/ai.controller";

const router = Router();

router.use(requireAuth);

router.post("/itinerary", validateBody(itinerarySchema), createItinerary);
router.get("/itinerary", myItineraries);
router.get("/recommendations", recommendations);
router.post("/chat", validateBody(chatMessageSchema), chatOnce);
router.post("/chat/stream", validateBody(chatMessageSchema), chatStream);
router.get("/chat/:sessionId", chatHistory);

export default router;
