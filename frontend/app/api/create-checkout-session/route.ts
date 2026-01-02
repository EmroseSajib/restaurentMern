import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20", // use latest from your dashboard
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, deliveryType, total, paymentMethod } = body;

    const line_items = items.map(
      ({ item, quantity }: { item: any; quantity: number }) => ({
        price_data: {
          currency: "eur",
          product_data: { name: item.name.en },
          unit_amount: Math.round(item.price * 100),
        },
        quantity,
      })
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "ideal"],
      line_items,
      customer_email: customer.email,
      metadata: {
        deliveryType,
        paymentMethod,
        name: customer.name,
        phone: customer.phone,
        address: customer.address || "",
        city: customer.city || "",
        postalCode: customer.postalCode || "",
        notes: customer.notes || "",
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
