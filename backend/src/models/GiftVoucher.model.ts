import mongoose, { InferSchemaType, Schema } from "mongoose";

const GiftVoucherSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, index: true },

    amount: { type: Number, required: true }, // EUR
    currency: { type: String, default: "EUR" },

    maxRedemptions: { type: Number, default: 1 },
    redemptionsCount: { type: Number, default: 0 },

    // status
    isActive: { type: Boolean, default: true },

    // must be paid before usable
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    stripeSessionId: { type: String, default: "", index: true },
    stripePaymentIntentId: { type: String, default: "" },

    recipientName: { type: String, default: "" },
    recipientEmail: { type: String, default: "" },
    message: { type: String, default: "" },
    type: { type: String, enum: ["percent", "fixed"], default: "fixed" },
    buyerName: { type: String, default: "" },
    buyerEmail: { type: String, default: "" },
  },
  { timestamps: true },
);

export type GiftVoucher = InferSchemaType<typeof GiftVoucherSchema>;
export const GiftVoucherModel = mongoose.model(
  "GiftVoucher",
  GiftVoucherSchema,
);
