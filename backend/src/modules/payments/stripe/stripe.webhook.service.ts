import { Request } from "express";
import Stripe from "stripe";
import { GiftVoucherModel } from "../../../models/GiftVoucher.model";
import { sendGiftVoucherEmail } from "../../../utils/mail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

export const StripeWebhookService = {
  async handle(req: Request) {
    const sig = req.headers["stripe-signature"] as string;

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const voucherId = session.metadata?.voucherId;

      if (voucherId) {
        const voucher = await GiftVoucherModel.findById(voucherId);

        // ✅ idempotent: only process once
        if (voucher && voucher.paymentStatus !== "paid") {
          voucher.paymentStatus = "paid";
          voucher.stripePaymentIntentId = String(session.payment_intent || "");
          await voucher.save();

          // ✅ Send email to recipient
          if (voucher.recipientEmail) {
            await sendGiftVoucherEmail({
              to: voucher.recipientEmail,
              recipientName: voucher.recipientName,
              buyerName: voucher.buyerName,
              amount: voucher.amount,
              code: voucher.code,
              message: voucher.message,
            });
          }
        }
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const voucherId = session.metadata?.voucherId;

      if (voucherId) {
        const voucher = await GiftVoucherModel.findById(voucherId);
        if (voucher && voucher.paymentStatus === "pending") {
          voucher.paymentStatus = "failed";
          await voucher.save();
        }
      }
    }
  },
};
