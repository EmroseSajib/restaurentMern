import nodemailer from "nodemailer";
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

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw new Error("SMTP_USER/SMTP_PASS missing in env");

  // Gmail App Password
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
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

    const amt = Math.round(Number(amount || 0));
    if (!Number.isFinite(amt) || amt < 10) throw badRequest("Minimum €10");
    if (!recipientEmail) throw badRequest("Recipient email required");
    if (!buyerEmail) throw badRequest("Buyer email required");

    const code = await createUniqueCode(customCode);
 
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

    const event = stripe.webhooks.constructEvent(req.body, sig, whSecret);
    console.log("✅ Gift voucher webhook HIT:", event.type);

    // card + ideal success
    if (
      event.type !== "checkout.session.completed" &&
      event.type !== "checkout.session.async_payment_succeeded"
    ) {
      return;
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const voucherId = session.metadata?.voucherId;
    if (!voucherId) throw new Error("Missing voucherId in session metadata");

    const voucher = await GiftVoucherModel.findById(voucherId);
    if (!voucher) throw new Error("Voucher not found");

    if (voucher.paymentStatus === "paid") return;

    voucher.paymentStatus = "paid";
    voucher.stripeSessionId = session.id;
    await voucher.save();

    const transporter = getTransporter();
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;

    const subject = `Your Gift Voucher (€${voucher.amount})`;

    const recipientText = `
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

    const buyerText = `
Hi ${voucher.buyerName || "there"},

Your gift voucher payment is confirmed ✅

Code: ${voucher.code}
Amount: €${voucher.amount}
Recipient: ${voucher.recipientEmail}

We also emailed the voucher to the recipient.

— Restaurant Team
    `.trim();

    try {
      await transporter.sendMail({
        from,
        to: voucher.recipientEmail,
        subject,
        text: recipientText,
        replyTo: voucher.buyerEmail,
      });

      await transporter.sendMail({
        from,
        to: voucher.buyerEmail,
        subject: `Voucher Purchased Successfully (€${voucher.amount})`,
        text: buyerText,
      });

      console.log("✅ Emails sent");
    } catch (err) {
      console.error("❌ Email sending failed:", err);
    }
  },
};
