import { Router } from "express";
import { StripeWebhookController } from "./stripe.webhook.controller";

const router = Router();

router.post(
  "/v1/webhooks/stripe",
  require("express").raw({ type: "application/json" }),
  StripeWebhookController.handle,
);

export default router;
