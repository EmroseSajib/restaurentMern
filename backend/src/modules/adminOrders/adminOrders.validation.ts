import { z } from "zod";

export const listOrdersQuerySchema = z.object({
  status: z
    .enum([
      "new",
      "confirmed",
      "preparing",
      "ready",
      "delivering",
      "completed",
      "cancelled",
    ])
    .optional(),
  paymentMethod: z.enum(["cod", "stripe"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed"]).optional(),

  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),

  q: z.string().trim().min(1).max(40).optional(), // orderNumber search

  page: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => Number(v ?? 1))
    .refine((n) => Number.isFinite(n) && n >= 1 && n <= 1000),

  limit: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => Number(v ?? 20))
    .refine((n) => Number.isFinite(n) && n >= 1 && n <= 100),
});

export const orderIdParamSchema = z.object({
  id: z.string().min(1),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "new",
    "confirmed",
    "preparing",
    "ready",
    "delivering",
    "completed",
    "cancelled",
  ]),
});
