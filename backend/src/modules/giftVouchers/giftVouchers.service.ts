import Stripe from "stripe";
import { GiftVoucherModel } from "../../models/GiftVoucher.model";
import mail from "../../utils/mail";
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

  async handleStripeWebhook(req: any) {
    const sig = req.headers["stripe-signature"];
    if (!sig) throw new Error("Missing stripe-signature header");

    const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!whSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET in env");

    // req.body is a Buffer because of express.raw()
    const event = stripe.webhooks.constructEvent(req.body, sig, whSecret);

    // ✅ only handle success payment
    if (event.type !== "checkout.session.completed") return;

    const session = event.data.object as Stripe.Checkout.Session;
    const voucherId = session.metadata?.voucherId;

    if (!voucherId) throw new Error("Missing voucherId in session metadata");

    const voucher = await GiftVoucherModel.findById(voucherId);
    if (!voucher) throw new Error("Voucher not found");

    // Prevent double email if Stripe retries webhook
    if (voucher.paymentStatus === "paid") return;

    // Mark paid
    voucher.paymentStatus = "paid";
    voucher.stripeSessionId = session.id;
    await voucher.save();

    // ✅ send email to recipient + buyer
    const subject = `Your Gift Voucher (€${voucher.amount})`;

    const text = `
Hello ${voucher.recipientName || "there"},

You received a gift voucher!

Voucher Code: ${voucher.code}
Amount: €${voucher.amount}
One-time use.

Message from ${voucher.buyerName || "someone"}:
${voucher.message || "-"}

Redeem this voucher at checkout on our website.

Thank you,
Restaurant Team
    `.trim();

    // send to recipient
    await mail.sendMail({
      to: voucher.recipientEmail,
      subject,
      text,
    });

    // optional: send to buyer too
    await mail.sendMail({
      to: voucher.buyerEmail,
      subject: `Voucher Purchased Successfully (€${voucher.amount})`,
      text: `
Hi ${voucher.buyerName || "there"},

Your gift voucher payment is confirmed ✅

Code: ${voucher.code}
Amount: €${voucher.amount}
Recipient: ${voucher.recipientEmail}

We also emailed the voucher to the recipient.

— Restaurant Team
      `.trim(),
    });
  },
};
