import express, { Router } from "express";
import {
  createGiftVoucherCheckout,
  giftVoucherStripeWebhook,getVoucherAfterPayment
} from "./giftVouchers.controller";
const router = Router();
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  giftVoucherStripeWebhook,
);
router.post("/stripe/checkout", express.json(), createGiftVoucherCheckout);
// ✅ Stripe webhook (RAW)

router.get("/stripe/success", getVoucherAfterPayment);

export default router;
