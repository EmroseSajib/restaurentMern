import { type NextRequest, NextResponse } from "next/server"

// ===========================================
// ORDER API ROUTE
// Handles order creation and POS notification
// ===========================================

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface OrderData {
  orderNumber: string
  items: OrderItem[]
  customer: {
    name: string
    email: string
    phone: string
    address?: string
    city?: string
    postalCode?: string
    notes?: string
  }
  deliveryType: "delivery" | "pickup"
  total: number
  paymentMethod: string
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json()

    // Validate order data
    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 })
    }

    if (!orderData.customer.name || !orderData.customer.email) {
      return NextResponse.json({ error: "Missing customer information" }, { status: 400 })
    }

    // ===========================================
    // TODO: PAYMENT GATEWAY INTEGRATION
    // ===========================================
    // Integrate with your preferred payment provider:
    //
    // STRIPE EXAMPLE:
    // import Stripe from 'stripe'
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(orderData.total * 100), // Convert to cents
    //   currency: 'eur',
    //   metadata: { orderNumber: orderData.orderNumber },
    // })
    //
    // MOLLIE EXAMPLE (popular in Netherlands):
    // import { createMollieClient } from '@mollie/api-client'
    // const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! })
    // const payment = await mollie.payments.create({
    //   amount: { currency: 'EUR', value: orderData.total.toFixed(2) },
    //   description: `Order ${orderData.orderNumber}`,
    //   redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order/confirm?id=${orderData.orderNumber}`,
    //   webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mollie`,
    // })

    // ===========================================
    // TODO: POS SYSTEM NOTIFICATION
    // ===========================================
    // Send order to your POS system:
    //
    // GENERIC WEBHOOK:
    // await fetch(process.env.POS_WEBHOOK_URL!, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.POS_API_KEY}`,
    //   },
    //   body: JSON.stringify(orderData),
    // })
    //
    // PRINTER INTEGRATION:
    // Use a service like PrintNode or direct network printing
    //
    // KITCHEN DISPLAY SYSTEM:
    // Push to real-time database (Firebase, Supabase) for KDS

    // ===========================================
    // TODO: EMAIL CONFIRMATION
    // ===========================================
    // Send confirmation email to customer:
    //
    // SENDGRID EXAMPLE:
    // import sgMail from '@sendgrid/mail'
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    // await sgMail.send({
    //   to: orderData.customer.email,
    //   from: 'orders@dekleineman.nl',
    //   subject: `Order Confirmation - ${orderData.orderNumber}`,
    //   html: generateOrderEmailTemplate(orderData),
    // })
    //
    // RESEND EXAMPLE:
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY!)
    // await resend.emails.send({
    //   from: 'orders@dekleineman.nl',
    //   to: orderData.customer.email,
    //   subject: `Order Confirmation - ${orderData.orderNumber}`,
    //   react: OrderConfirmationEmail({ order: orderData }),
    // })

    // Log the order (replace with database storage)
    console.log("New order received:", {
      orderNumber: orderData.orderNumber,
      items: orderData.items.length,
      total: orderData.total,
      deliveryType: orderData.deliveryType,
      customer: orderData.customer.name,
    })

    return NextResponse.json({
      success: true,
      orderNumber: orderData.orderNumber,
      message: "Order placed successfully",
    })
  } catch (error) {
    console.error("Order processing error:", error)
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 })
  }
}
