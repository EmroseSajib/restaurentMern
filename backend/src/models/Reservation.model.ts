import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ReservationSchema = new Schema(
  {
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, default: "", trim: true },
    },
    partySize: { type: Number, required: true, min: 1, max: 50 },

    // store as Date in UTC; frontend sends ISO string
    reservationAt: { type: Date, required: true, index: true },

    notes: { type: String, default: "", trim: true },

    status: {
      type: String,
      enum: ["new", "confirmed", "cancelled", "completed"],
      default: "new",
      index: true,
    },
    source: { type: String, enum: ["web"], default: "web" },
  },
  { timestamps: true }
);

export type Reservation = InferSchemaType<typeof ReservationSchema>;
export const ReservationModel = mongoose.model(
  "Reservation",
  ReservationSchema
);
