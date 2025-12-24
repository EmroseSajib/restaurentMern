import { z } from "zod";

const boolish = z
  .union([z.boolean(), z.string()])
  .optional()
  .transform((v) => (typeof v === "string" ? v === "true" : v));

export const menuQuerySchema = z.object({
  q: z.string().trim().min(1).max(80).optional(),
  category: z.string().trim().min(1).optional(),

  available: boolish,
  isMainDish: boolish,
  vegetarian: boolish,
  vegan: boolish,
  glutenFree: boolish,
  spicy: boolish,
  nuts: boolish,

  page: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => Number(v ?? 1))
    .refine((n) => Number.isFinite(n) && n >= 1 && n <= 1000),
  limit: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => Number(v ?? 24))
    .refine((n) => Number.isFinite(n) && n >= 1 && n <= 100),
});

export const categoryCreateSchema = z.object({
  name: z.object({
    en: z.string().min(1).max(80),
    nl: z.string().min(1).max(80),
    de: z.string().min(1).max(80),
  }),
  slug: z.string().min(1).max(80),
  sortOrder: z.number().int().min(0).max(10000).optional(),
  isActive: z.boolean().optional(),
});

export const menuItemCreateSchema = z.object({
  categoryId: z.string().min(1),
  name: z.object({
    en: z.string().min(1).max(100),
    nl: z.string().min(1).max(100),
    de: z.string().min(1).max(100),
  }),
  description: z
    .object({
      en: z.string().max(500).optional(),
      nl: z.string().max(500).optional(),
      de: z.string().max(500).optional(),
    })
    .optional(),
  imageUrl: z.string().url().optional(),
  price: z.object({
    amount: z.number().int().min(0),
    currency: z.string().min(3).max(3).default("EUR").optional(),
  }),

  available: z.boolean().optional(),
  isMainDish: z.boolean().optional(),
  vegetarian: z.boolean().optional(),
  vegan: z.boolean().optional(),
  glutenFree: z.boolean().optional(),
  spicy: z.boolean().optional(),
  nuts: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(10000).optional(),
});
