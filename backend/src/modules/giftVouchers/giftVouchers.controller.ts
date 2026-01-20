import { Request, Response } from "express";
import { GiftVouchersService } from "./giftVouchers.service";

export const GiftVouchersController = {
  async createStripeCheckout(req: Request, res: Response) {
    try {
      const data = await GiftVouchersService.createStripeCheckout(req.body);
      return res.json({ success: true, data });
    } catch (e: any) {
      return res
        .status(e.status || 500)
        .json({ success: false, message: e.message || "Checkout failed" });
    }
  },
};
