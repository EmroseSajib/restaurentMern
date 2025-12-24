import { z } from "zod";

export const createCateringRequestSchema = z.object({
  customer: z.object({
    name: z.string().min(2).max(80),
    phone: z.string().min(6).max(30),
    email: z.string().email().optional().or(z.literal("")),
    company: z.string().max(120).optional().or(z.literal("")),
  }),
  event: z.object({
    date: z.string().datetime(), // ISO
    peopleCount: z.number().int().min(1).max(500),
    location: z.string().max(160).optional().or(z.literal("")),
    occasion: z.string().max(80).optional().or(z.literal("")),
  }),
  preferences: z
    .object({
      dietaryNotes: z.string().max(300).optional().or(z.literal("")),
      budgetRange: z.string().max(80).optional().or(z.literal("")),
    })
    .optional(),
  message: z.string().max(1000).optional().or(z.literal("")),
});

export const listCateringQuerySchema = z.object({
  status: z
    .enum(["new", "contacted", "quoted", "confirmed", "cancelled"])
    .optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
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

export const cateringIdParamSchema = z.object({
  id: z.string().min(1),
});

export const updateCateringStatusSchema = z.object({
  status: z.enum(["new", "contacted", "quoted", "confirmed", "cancelled"]),
});
