import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// ===========================================
// GIFT VOUCHER API ROUTE
// Handles voucher purchases and email notifications
// ===========================================

interface VoucherData {
  amount: number;
  voucherCode: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  buyerName: string;
  buyerEmail: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: VoucherData = await request.json();

    // Validate required fields
    if (!data.amount || data.amount < 10) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (
      !data.recipientName ||
      !data.recipientEmail ||
      !data.buyerName ||
      !data.buyerEmail
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ===========================================
    // TODO: PAYMENT PROCESSING
    // ===========================================
    // Process payment before generating voucher:
    //
    // STRIPE EXAMPLE:
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100),
      currency: "eur",
      metadata: {
        voucherCode: data.voucherCode,
        recipientEmail: data.recipientEmail,
      },
    });

    // ===========================================
    // TODO: DATABASE STORAGE
    // ===========================================
    // Store voucher in database:
    //
    // PRISMA EXAMPLE:
    // await prisma.voucher.create({
    //   data: {
    //     code: data.voucherCode,
    //     amount: data.amount,
    //     balance: data.amount, // Remaining balance
    //     recipientName: data.recipientName,
    //     recipientEmail: data.recipientEmail,
    //     message: data.message,
    //     buyerName: data.buyerName,
    //     buyerEmail: data.buyerEmail,
    //     expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    //     status: 'active',
    //   },
    // })

    // ===========================================
    // TODO: EMAIL NOTIFICATIONS
    // ===========================================
    // Send voucher to recipient:
    //
    // SENDGRID EXAMPLE:
    // await sgMail.send({
    //   to: data.recipientEmail,
    //   from: 'gifts@dekleineman.nl',
    //   subject: `You received a gift voucher from ${data.buyerName}!`,
    //   html: generateVoucherEmail({
    //     recipientName: data.recipientName,
    //     buyerName: data.buyerName,
    //     amount: data.amount,
    //     code: data.voucherCode,
    //     message: data.message,
    //   }),
    // })
    //
    // // Confirmation to buyer
    // await sgMail.send({
    //   to: data.buyerEmail,
    //   from: 'gifts@dekleineman.nl',
    //   subject: 'Gift Voucher Purchase Confirmation',
    //   html: generateBuyerConfirmation(data),
    // })

    // Log the voucher
    console.log("New voucher purchased:", {
      code: data.voucherCode,
      amount: data.amount,
      recipient: data.recipientEmail,
      buyer: data.buyerEmail,
    });

    return NextResponse.json({
      success: true,
      voucherCode: data.voucherCode,
      message: "Voucher created successfully",
    });
  } catch (error) {
    console.error("Voucher error:", error);
    return NextResponse.json(
      { error: "Failed to create voucher" },
      { status: 500 }
    );
  }
}

// ===========================================
// VOUCHER REDEMPTION
// ===========================================
// This endpoint would validate and apply vouchers during checkout
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Voucher code required" },
      { status: 400 }
    );
  }

  // ===========================================
  // TODO: VALIDATE VOUCHER
  // ===========================================
  // Check voucher in database:
  //
  // const voucher = await prisma.voucher.findUnique({
  //   where: { code: code.toUpperCase() },
  // })
  //
  // if (!voucher) {
  //   return NextResponse.json({ valid: false, error: 'Invalid code' })
  // }
  //
  // if (voucher.status !== 'active') {
  //   return NextResponse.json({ valid: false, error: 'Voucher already used' })
  // }
  //
  // if (voucher.expiresAt < new Date()) {
  //   return NextResponse.json({ valid: false, error: 'Voucher expired' })
  // }
  //
  // return NextResponse.json({
  //   valid: true,
  //   balance: voucher.balance,
  // })

  // Mock response for demo
  const mockVouchers: Record<string, number> = {
    GIFT25: 25,
    GIFT50: 50,
  };

  const upperCode = code.toUpperCase();
  if (mockVouchers[upperCode]) {
    return NextResponse.json({
      valid: true,
      balance: mockVouchers[upperCode],
    });
  }

  return NextResponse.json({
    valid: false,
    error: "Invalid voucher code",
  });
}
