import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { GiftVouchersService } from "./giftVouchers.service";
import { validateGiftVoucher } from "./validateGiftVoucher";

// ✅ 1) Create Stripe Checkout (same as you already have)
export const createGiftVoucherCheckout = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const data = await GiftVouchersService.createStripeCheckout(req.body);
      return res.json({ success: true, data });
    } catch (e: any) {
      return res
        .status(e.status || 500)
        .json({ success: false, message: e.message || "Checkout failed" });
    }
  },
);

// ✅ 2) Stripe Webhook (no try/catch inside asyncHandler needed)
export const giftVoucherStripeWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    // IMPORTANT: Stripe needs raw body, so req.body is Buffer
    await GiftVouchersService.handleStripeWebhook(req);

    // Stripe expects 200 quickly
    return res.json({ received: true });
  },
);
export const getVoucherAfterPayment = asyncHandler(async (req, res) => {
  const sessionId = String(req.query.session_id || "");
  if (!sessionId)
    return res
      .status(400)
      .json({ success: false, message: "session_id required" });

  const data = await GiftVouchersService.getVoucherAfterPayment(sessionId);
  return res.json({ success: true, data });
});
export const validateGiftVoucherController = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await validateGiftVoucher(req.body);
    return res.json({ success: true, data });
  },
);

// OPTIONAL
export const redeemGiftVoucher = asyncHandler(
  async (req: Request, res: Response) => {
    const code = String(req.body?.code || "");
    const data = await GiftVouchersService.redeemVoucher(code);
    return res.json({ success: true, data });
  },
);
