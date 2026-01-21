import express, { Router } from "express";
import {
  createGiftVoucherCheckout,
  giftVoucherStripeWebhook,
} from "./giftVouchers.controller";
const router = Router();

router.post("/stripe/checkout", createGiftVoucherCheckout);
// ✅ Stripe webhook (RAW)
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  giftVoucherStripeWebhook,
);

export default router;
