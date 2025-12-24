import mongoose, { Schema, type InferSchemaType } from "mongoose";

const AdminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type Admin = InferSchemaType<typeof AdminSchema>;
export const AdminModel = mongoose.model("Admin", AdminSchema);
