import mongoose, { Schema, type InferSchemaType } from "mongoose";

const MenuCategorySchema = new Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      nl: { type: String, required: true, trim: true },
      de: { type: String, required: true, trim: true },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type MenuCategory = InferSchemaType<typeof MenuCategorySchema>;
export const MenuCategoryModel = mongoose.model(
  "MenuCategory",
  MenuCategorySchema
);
