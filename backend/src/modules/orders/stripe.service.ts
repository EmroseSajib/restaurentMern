import { env } from "../../config/env";
import { stripe } from "../../config/stripe";
import { OrderModel } from "../../models/Order.model";
import { ApiError } from "../../utils/apiError";

export async function createStripeCheckoutSession(orderId: string) {
  if (!stripe) throw new ApiError(500, "Stripe not configured");

  const order = await OrderModel.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  if (order.payment.method !== "stripe")
    throw new ApiError(400, "Order is not Stripe payment");
  if (order.payment.status === "paid")
    throw new ApiError(400, "Order already paid");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    client_reference_id: String(order._id),
    success_url: `${env.PUBLIC_SITE_URL}/order-success?orderId=${order._id}`,
    cancel_url: `${env.PUBLIC_SITE_URL}/checkout?cancelled=1&orderId=${order._id}`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: order.totals.total.currency.toLowerCase(),
          unit_amount: order.totals.total.amount,
          product_data: {
            name: `dekleineman Order ${order.orderNumber}`,
          },
        },
      },
    ],
    metadata: {
      orderId: String(order._id),
      orderNumber: order.orderNumber,
    },
  });

  order.payment.stripeSessionId = session.id;
  await order.save();

  return { url: session.url };
}
