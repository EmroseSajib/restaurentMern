import { z } from "zod";

const timeHHMM = z.string().regex(/^\d{2}:\d{2}$/, "Expected HH:MM");

const hoursRangeSchema = z.object({
  start: timeHHMM,
  end: timeHHMM,
});

const dayHoursSchema = z.object({
  isClosed: z.boolean(),
  ranges: z.array(hoursRangeSchema).max(4),
});

const weeklyHoursSchema = z.object({
  mon: dayHoursSchema,
  tue: dayHoursSchema,
  wed: dayHoursSchema,
  thu: dayHoursSchema,
  fri: dayHoursSchema,
  sat: dayHoursSchema,
  sun: dayHoursSchema,
});

export const updateSettingsSchema = z.object({
  restaurant: z.object({
    name: z.string().min(1).max(80),
    cuisine: z.string().min(1).max(80),
    address: z.string().min(1).max(160),
    phone: z.string().min(1).max(40),
    country: z.string().min(2).max(2).optional(),
  }),
  fulfillment: z.object({
    deliveryEnabled: z.boolean(),
    pickupEnabled: z.boolean(),
    minOrderAmount: z.number().int().min(0),
  }),
  openingHours: weeklyHoursSchema,
  deliveryHours: weeklyHoursSchema,
});
