import mongoose, { Schema, type InferSchemaType } from "mongoose";

const VoucherSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    type: { type: String, enum: ["percent", "fixed"], required: true },

    // percent: 1..100, fixed: cents
    value: { type: Number, required: true, min: 1 },

    currency: { type: String, default: "EUR" },

    minOrderAmount: { type: Number, default: 0 }, // cents

    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },

    maxRedemptions: { type: Number, default: 0 }, // 0 = unlimited
    redeemedCount: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type Voucher = InferSchemaType<typeof VoucherSchema>;
export const VoucherModel = mongoose.model("Voucher", VoucherSchema);
