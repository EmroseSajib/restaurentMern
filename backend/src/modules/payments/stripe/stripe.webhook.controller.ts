import { Request, Response } from "express";
import { StripeWebhookService } from "./stripe.webhook.service";

export const StripeWebhookController = {
  async handle(req: Request, res: Response) {
    try {
      await StripeWebhookService.handle(req);
      return res.json({ received: true });
    } catch (e: any) {
      return res.status(400).send(`Webhook Error: ${e.message}`);
    }
  },
};
