import { z } from "zod";

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(2).max(80),
    phone: z.string().min(6).max(30),
    email: z.string().email().optional().or(z.literal("")),
  }),
  fulfillment: z.object({
    type: z.enum(["delivery", "pickup"]),
    address: z
      .object({
        line1: z.string().max(120).optional().or(z.literal("")),
        postalCode: z.string().max(20).optional().or(z.literal("")),
        city: z.string().max(80).optional().or(z.literal("")),
        country: z.string().max(2).optional().or(z.literal("NL")),
      })
      .optional(),
    notes: z.string().max(300).optional().or(z.literal("")),
  }),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1)
    .max(50),

  // only allowed if all items are main dishes (we enforce server-side)
  bonus: z.enum(["rice", "naan", "none"]).optional(),

  // optional inputs; server decides if valid + amount
  voucherCode: z.string().max(40).optional().or(z.literal("")),
  membershipId: z.string().max(60).optional().or(z.literal("")),

  paymentMethod: z.enum(["cod", "stripe"]),
});

export const orderIdParamSchema = z.object({
  id: z.string().min(1),
});
