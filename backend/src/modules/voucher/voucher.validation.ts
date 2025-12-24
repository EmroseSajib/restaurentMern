import { z } from "zod";

export const validateVoucherSchema = z.object({
  code: z.string().trim().min(2).max(40),
  subtotalAmount: z.number().int().min(0), // cents
  currency: z.string().min(3).max(3).default("EUR").optional(),
});

export const voucherCreateSchema = z.object({
  code: z.string().trim().min(2).max(40),
  type: z.enum(["percent", "fixed"]),
  value: z.number().int().min(1),
  currency: z.string().min(3).max(3).default("EUR").optional(),
  minOrderAmount: z.number().int().min(0).optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  maxRedemptions: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});
