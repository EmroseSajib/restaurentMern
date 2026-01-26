import express, { Router } from "express";
import {
  createGiftVoucherCheckout,
  getVoucherAfterPayment,
  giftVoucherStripeWebhook,
  redeemGiftVoucher,
  validateGiftVoucherController,
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
router.post("/validate", express.json(), validateGiftVoucherController);
router.post("/redeem", express.json(), redeemGiftVoucher);

export default router;
