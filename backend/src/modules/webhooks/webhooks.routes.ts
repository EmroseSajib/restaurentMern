import { Router } from "express";
import { stripeWebhook } from "./stripeWebhook.controller";

const router = Router();

// This route is already set to raw-body in app.ts with app.post(..., express.raw())
// Here we just attach the handler.
router.post("/stripe", stripeWebhook);

export default router;
