import mongoose, { Schema, type InferSchemaType } from "mongoose";

const HoursRangeSchema = new Schema(
  {
    start: { type: String, required: true }, // "11:00"
    end: { type: String, required: true }, // "22:00"
  },
  { _id: false }
);

const DayHoursSchema = new Schema(
  {
    isClosed: { type: Boolean, default: false },
    ranges: { type: [HoursRangeSchema], default: [] },
  },
  { _id: false }
);

const WeeklyHoursSchema = new Schema(
  {
    mon: { type: DayHoursSchema, required: true },
    tue: { type: DayHoursSchema, required: true },
    wed: { type: DayHoursSchema, required: true },
    thu: { type: DayHoursSchema, required: true },
    fri: { type: DayHoursSchema, required: true },
    sat: { type: DayHoursSchema, required: true },
    sun: { type: DayHoursSchema, required: true },
  },
  { _id: false }
);

const SettingsSchema = new Schema(
  {
    key: { type: String, default: "global", unique: true, index: true },

    restaurant: {
      name: { type: String, required: true },
      cuisine: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      country: { type: String, default: "NL" },
    },

    fulfillment: {
      deliveryEnabled: { type: Boolean, default: true },
      pickupEnabled: { type: Boolean, default: true },
      minOrderAmount: { type: Number, default: 0 }, // cents
    },

    openingHours: { type: WeeklyHoursSchema, required: true },
    deliveryHours: { type: WeeklyHoursSchema, required: true },
  },
  { timestamps: true }
);

export type Settings = InferSchemaType<typeof SettingsSchema>;
export const SettingsModel = mongoose.model("Settings", SettingsSchema);
