import mongoose, { Schema, type InferSchemaType } from "mongoose";

const MoneySchema = new Schema(
  {
    amount: { type: Number, required: true, min: 0 }, // cents
    currency: { type: String, required: true, default: "EUR" },
  },
  { _id: false }
);

const MenuItemSchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: true,
      index: true,
    },

    name: {
      en: { type: String, required: true, trim: true },
      nl: { type: String, required: true, trim: true },
      de: { type: String, required: true, trim: true },
    },
    description: {
      en: { type: String, default: "", trim: true },
      nl: { type: String, default: "", trim: true },
      de: { type: String, default: "", trim: true },
    },

    imageUrl: { type: String, default: "" },

    price: { type: MoneySchema, required: true },

    available: { type: Boolean, default: true },

    // your frontend flags
    isMainDish: { type: Boolean, default: false },
    vegetarian: { type: Boolean, default: false },
    vegan: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    spicy: { type: Boolean, default: false },
    nuts: { type: Boolean, default: false },

    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// helpful indexes for search/filter
MenuItemSchema.index({
  "name.en": "text",
  "name.nl": "text",
  "name.de": "text",
});

export type MenuItem = InferSchemaType<typeof MenuItemSchema>;
export const MenuItemModel = mongoose.model("MenuItem", MenuItemSchema);
