import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CateringRequestSchema = new Schema(
  {
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, default: "", trim: true },
      company: { type: String, default: "", trim: true },
    },

    event: {
      date: { type: Date, required: true, index: true }, // event date/time
      peopleCount: { type: Number, required: true, min: 1, max: 500 },
      location: { type: String, default: "", trim: true },
      occasion: { type: String, default: "", trim: true },
    },

    preferences: {
      dietaryNotes: { type: String, default: "", trim: true },
      budgetRange: { type: String, default: "", trim: true },
    },

    message: { type: String, default: "", trim: true },

    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "confirmed", "cancelled"],
      default: "new",
      index: true,
    },

    source: { type: String, enum: ["web"], default: "web" },
  },
  { timestamps: true }
);

export type CateringRequest = InferSchemaType<typeof CateringRequestSchema>;
export const CateringRequestModel = mongoose.model(
  "CateringRequest",
  CateringRequestSchema
);
