import mongoose, { Schema, type InferSchemaType } from "mongoose";

const OrderItemSchema = new Schema(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    nameSnapshot: {
      en: { type: String, required: true },
      nl: { type: String, required: true },
      de: { type: String, required: true },
    },
    unitPrice: { type: Number, required: true }, // snapshot at time of order
    quantity: { type: Number, required: true, min: 1, max: 50 },

    // snapshot flags
    isMainDish: { type: Boolean, default: false },
    vegetarian: { type: Boolean, default: false },
    vegan: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    spicy: { type: Boolean, default: false },
    nuts: { type: Boolean, default: false },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },

    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, default: "", trim: true },
    },

    fulfillment: {
      type: { type: String, enum: ["delivery", "pickup"], required: true },
      address: {
        line1: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        city: { type: String, default: "" },
        country: { type: String, default: "NL" },
      },
      notes: { type: String, default: "" },
    },

    items: { type: [OrderItemSchema], required: true },

    bonus: {
      type: { type: String, enum: ["rice", "naan", "none"], default: "none" },
      price: { type: Number, required: true },
    },

    discounts: {
      voucherCode: { type: String, default: "" },
      membershipId: { type: String, default: "" },
      discountTotal: { type: Number, required: true },
    },

    totals: {
      subtotal: { type: Number, required: true },
      total: { type: Number, required: true },
    },

    payment: {
      method: { type: String, enum: ["cod", "stripe"], required: true },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      stripeSessionId: { type: String, default: "" },
    },

    status: {
      type: String,
      enum: [
        "new",
        "confirmed",
        "preparing",
        "ready",
        "delivering",
        "completed",
        "cancelled",
      ],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

export type Order = InferSchemaType<typeof OrderSchema>;
export const OrderModel = mongoose.model("Order", OrderSchema);
