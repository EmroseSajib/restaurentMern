import { MenuCategoryModel } from "../../models/MenuCategory.model";
import { MenuItemModel } from "../../models/MenuItem.model";
import { ApiError } from "../../utils/apiError";

export async function listCategories() {
  const categories = await MenuCategoryModel.find({ isActive: true })
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();

  return categories.map((c) => ({
    id: String(c._id),
    slug: c.slug,
    name: c.name,
    sortOrder: c.sortOrder,
  }));
}

export async function listMenu(query: {
  q?: string;
  category?: string;
  available?: boolean;
  isMainDish?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  spicy?: boolean;
  nuts?: boolean;
  page: number;
  limit: number;
}) {
  const filter: any = {};

  // category by slug
  if (query.category) {
    const cat = await MenuCategoryModel.findOne({
      slug: query.category,
      isActive: true,
    }).lean();
    if (!cat) throw new ApiError(404, "Category not found");
    filter.categoryId = cat._id;
  }

  // bool filters
  for (const key of [
    "available",
    "isMainDish",
    "vegetarian",
    "vegan",
    "glutenFree",
    "spicy",
    "nuts",
  ] as const) {
    const v = query[key];
    if (typeof v === "boolean") filter[key] = v;
  }

  // search
  if (query.q) {
    filter.$text = { $search: query.q };
  }

  const page = query.page ?? 1;
  const limit = query.limit ?? 24;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    MenuItemModel.find(filter)
      .sort(
        query.q
          ? { score: { $meta: "textScore" } }
          : { sortOrder: 1, createdAt: -1 }
      )
      .skip(skip)
      .limit(limit)
      .lean(),
    MenuItemModel.countDocuments(filter),
  ]);

  return {
    page,
    limit,
    total,
    items: items.map((i) => ({
      id: String(i._id),
      categoryId: String(i.categoryId),
      name: i.name,
      description: i.description,
      imageUrl: i.imageUrl,
      price: i.price, // {amount,currency}
      available: i.available,
      isMainDish: i.isMainDish,
      vegetarian: i.vegetarian,
      vegan: i.vegan,
      glutenFree: i.glutenFree,
      spicy: i.spicy,
      nuts: i.nuts,
      sortOrder: i.sortOrder,
    })),
  };
}

// admin helpers (simple start)
export async function adminCreateCategory(input: any) {
  const exists = await MenuCategoryModel.findOne({
    slug: input.slug.toLowerCase(),
  }).lean();
  if (exists) throw new ApiError(409, "Category slug already exists");
  const created = await MenuCategoryModel.create({
    ...input,
    slug: input.slug.toLowerCase(),
  });
  return { id: String(created._id) };
}

export async function adminCreateMenuItem(input: any) {
  const created = await MenuItemModel.create(input);
  return { id: String(created._id) };
}
