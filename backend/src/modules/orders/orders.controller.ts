import type { Request, Response } from "express";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { createOrder, getOrderById } from "./orders.service";
import { createOrderSchema, orderIdParamSchema } from "./orders.validation";
import { createStripeCheckoutSession } from "./stripe.service";

export const postOrder = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Invalid input");

  const data = await createOrder({
    customer: parsed.data.customer,
    fulfillment: parsed.data.fulfillment as any,
    items: parsed.data.items,
    bonus: parsed.data.bonus,
    voucherCode: parsed.data.voucherCode ?? "",
    membershipId: parsed.data.membershipId ?? "",
    paymentMethod: parsed.data.paymentMethod,
  });

  res.status(201).json({ success: true, data });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const parsed = orderIdParamSchema.safeParse(req.params);
  if (!parsed.success) throw new ApiError(400, "Invalid id");

  const data = await getOrderById(parsed.data.id);
  res.json({ success: true, data });
});

export const postStripeCheckout = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = orderIdParamSchema.safeParse(req.params);
    if (!parsed.success) throw new ApiError(400, "Invalid id");

    const data = await createStripeCheckoutSession(parsed.data.id);
    res.json({ success: true, data });
  }
);
