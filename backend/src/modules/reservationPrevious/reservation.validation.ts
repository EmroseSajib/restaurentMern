import { z } from "zod";

export const createReservationSchema = z.object({
  customer: z.object({
    name: z.string().min(2).max(80),
    phone: z.string().min(6).max(30),
    email: z.string().email().optional().or(z.literal("")),
  }),
  partySize: z.number().int().min(1).max(50),
  reservationAt: z.string().datetime(), // ISO string from frontend
  notes: z.string().max(300).optional().or(z.literal("")),
});

export const listReservationsQuerySchema = z.object({
  status: z.enum(["new", "confirmed", "cancelled", "completed"]).optional(),
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

export const reservationIdParamSchema = z.object({
  id: z.string().min(1),
});

export const updateReservationStatusSchema = z.object({
  status: z.enum(["new", "confirmed", "cancelled", "completed"]),
});
