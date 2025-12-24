import { env } from "../../config/env";
import { stripe } from "../../config/stripe";
import { OrderModel } from "../../models/Order.model";
import { ApiError } from "../../utils/apiError";

export async function handleStripeWebhook(
  rawBody: Buffer,
  signature: string | string[] | undefined
) {
  if (!stripe) throw new ApiError(500, "Stripe not configured");
  if (!env.STRIPE_SECRET_KEY) throw new ApiError(500, "Stripe not configured");
  if (!process.env.STRIPE_WEBHOOK_SECRET)
    throw new ApiError(500, "Missing STRIPE_WEBHOOK_SECRET");
  if (!signature || Array.isArray(signature))
    throw new ApiError(400, "Missing stripe signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    throw new ApiError(
      400,
      `Webhook signature verification failed: ${err?.message ?? "unknown"}`
    );
  }

  // ✅ Handle Checkout Session completion (best match for your flow)
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const sessionId = session.id as string;
    const orderIdFromMetadata = session.metadata?.orderId as string | undefined;
    const paymentStatus = session.payment_status as string | undefined; // "paid" usually

    if (paymentStatus === "paid") {
      // Try find order by stored sessionId; fallback to metadata orderId
      const filter = sessionId
        ? { "payment.stripeSessionId": sessionId }
        : orderIdFromMetadata
        ? { _id: orderIdFromMetadata }
        : null;

      if (filter) {
        await OrderModel.updateOne(filter, {
          $set: {
            "payment.status": "paid",
            status: "confirmed", // optional: change if you prefer not to auto-confirm
          },
        });
      }
    }
  }

  // Optional: handle async payment confirmation
  // (Useful if you move to Payment Intents later)
  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as any;
    const orderIdFromMetadata = pi.metadata?.orderId as string | undefined;
    if (orderIdFromMetadata) {
      await OrderModel.updateOne(
        { _id: orderIdFromMetadata },
        { $set: { "payment.status": "paid", status: "confirmed" } }
      );
    }
  }

  // You can also handle failures:
  if (
    event.type === "checkout.session.async_payment_failed" ||
    event.type === "payment_intent.payment_failed"
  ) {
    // best-effort mark failed if we can locate it
    const obj = event.data.object as any;
    const orderIdFromMetadata = obj.metadata?.orderId as string | undefined;
    const sessionId = obj.id as string | undefined;

    const filter = orderIdFromMetadata
      ? { _id: orderIdFromMetadata }
      : sessionId
      ? { "payment.stripeSessionId": sessionId }
      : null;

    if (filter) {
      await OrderModel.updateOne(filter, {
        $set: { "payment.status": "failed" },
      });
    }
  }

  return { received: true, type: event.type };
}
