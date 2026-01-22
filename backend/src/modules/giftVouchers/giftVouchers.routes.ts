import express, { Router } from "express";
import {
  createGiftVoucherCheckout,
  giftVoucherStripeWebhook,
} from "./giftVouchers.controller";
const router = Router();
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  giftVoucherStripeWebhook,
);
router.post("/stripe/checkout", createGiftVoucherCheckout);
// ✅ Stripe webhook (RAW)

export default router;
