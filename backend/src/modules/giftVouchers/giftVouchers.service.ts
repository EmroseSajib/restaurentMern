import Stripe from "stripe";
import { GiftVoucherModel } from "../../models/GiftVoucher.model";
import {
  generateVoucherCode,
  isValidCustomCode,
  normalizeCode,
} from "../../utils/voucherCode";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

function badRequest(message: string) {
  const err: any = new Error(message);
  err.status = 400;
  return err;
}

async function createUniqueCode(customCode?: string) {
  if (customCode?.trim()) {
    if (!isValidCustomCode(customCode))
      throw badRequest("Invalid custom code format");
    const c = normalizeCode(customCode);
    const exists = await GiftVoucherModel.findOne({ code: c });
    if (exists) {
      const err: any = new Error("Code already taken");
      err.status = 409;
      throw err;
    }
    return c;
  }

  // auto-generate with retries
  for (let i = 0; i < 10; i++) {
    const code = generateVoucherCode();
    const exists = await GiftVoucherModel.findOne({ code });
    if (!exists) return code;
  }
  throw new Error("Could not generate a unique voucher code");
}

export const GiftVouchersService = {
  async createStripeCheckout(payload: any) {
    const {
      amount,
      recipientName,
      recipientEmail,
      message,
      buyerName,
      buyerEmail,
      customCode,
    } = payload;
    console.log("Payload received for voucher creation:", payload);
    const amt = Math.round(Number(amount || 0));
    if (!Number.isFinite(amt) || amt < 10) throw badRequest("Minimum €10");
    if (!recipientEmail) throw badRequest("Recipient email required");
    if (!buyerEmail) throw badRequest("Buyer email required");

    // ✅ code: custom or auto
    const code = await createUniqueCode(customCode);

    // create pending voucher
    const voucher = await GiftVoucherModel.create({
      code,
      amount: amt,
      currency: "EUR",
      maxRedemptions: 1,
      redemptionsCount: 0,
      isActive: true,
      paymentStatus: "pending",
      recipientName: recipientName || "",
      recipientEmail,
      message: message || "",
      buyerName: buyerName || "",
      buyerEmail,
    });

    const frontend = process.env.FRONTEND_URL;
    if (!frontend || !frontend.startsWith("http")) {
      throw new Error("FRONTEND_URL must include http:// or https://");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // ✅ show BOTH
      payment_method_types: ["card", "ideal"],
      customer_email: buyerEmail,

      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amt * 100,
            product_data: { name: `Gift Voucher (€${amt})` },
          },
        },
      ],

      success_url: `${frontend}/gift-voucher/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontend}/gift-voucher?cancelled=1`,

      metadata: { voucherId: String(voucher._id) },
    });

    voucher.stripeSessionId = session.id;
    await voucher.save();

    return { url: session.url };
  },
};
