import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { handleStripeWebhook } from "./stripeWebhook.service";

export const stripeWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    // because we used express.raw() on this route, req.body is a Buffer
    const rawBody = req.body as Buffer;
    const sig = req.headers["stripe-signature"];

    const result = await handleStripeWebhook(rawBody, sig);
    res.json(result);
  }
);
