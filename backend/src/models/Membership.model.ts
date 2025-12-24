import mongoose, { Schema, type InferSchemaType } from "mongoose";

const MembershipSchema = new Schema(
  {
    membershipId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: { type: String, default: "" },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export type Membership = InferSchemaType<typeof MembershipSchema>;
export const MembershipModel = mongoose.model("Membership", MembershipSchema);
