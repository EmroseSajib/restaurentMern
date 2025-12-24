import mongoose, { Schema, type InferSchemaType } from "mongoose";

const AdminRefreshTokenSchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
    replacedByTokenHash: { type: String, default: null },
    userAgent: { type: String, default: null },
    ip: { type: String, default: null },
  },
  { timestamps: true }
);

AdminRefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type AdminRefreshToken = InferSchemaType<typeof AdminRefreshTokenSchema>;
export const AdminRefreshTokenModel = mongoose.model(
  "AdminRefreshToken",
  AdminRefreshTokenSchema
);
