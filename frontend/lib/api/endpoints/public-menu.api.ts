import { apiClient, ApiResponse } from "../client";

export type LocalizedText = { en: string; nl: string; de: string };

export type CategoryDto = {
  id: string;
  slug: string;
  name: LocalizedText;
  sortOrder: number;
};

export type MenuItemDto = {
  id: string;
  categoryId: string;
  // sometimes backend also returns categorySlug; if it exists, great
  categorySlug?: string;

  name: LocalizedText;
  description: LocalizedText;

  price: { amount: number; currency: string };

  available: boolean;
  isMainDish: boolean;

  spicy: boolean;
  nuts: boolean;
  glutenFree: boolean;
  vegetarian: boolean;
  vegan: boolean;

  imageUrl?: string;
};

export type MenuListResponse = ApiResponse<{
  page: number;
  limit: number;
  total: number;
  items: MenuItemDto[];
}>;

export async function getMenuCategories(): Promise<ApiResponse<CategoryDto[]>> {
  return apiClient.get<ApiResponse<CategoryDto[]>>("/menu/categories");
}

export type MenuQueryParams = {
  category?: string; // slug
  q?: string;
  page?: number;
  limit?: number;

  available?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  nuts?: boolean;
};

export async function getMenu(
  params: MenuQueryParams
): Promise<MenuListResponse> {
  const qs = new URLSearchParams();

  if (params.category) qs.set("category", params.category);
  if (params.q) qs.set("q", params.q);

  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));

  // Only include boolean filters if true (or explicitly false if you want)
  if (params.available) qs.set("available", "true");
  if (params.spicy) qs.set("spicy", "true");
  if (params.vegetarian) qs.set("vegetarian", "true");
  if (params.vegan) qs.set("vegan", "true");
  if (params.glutenFree) qs.set("glutenFree", "true");
  if (params.nuts) qs.set("nuts", "true");

  const endpoint = `/menu${qs.toString() ? `?${qs.toString()}` : ""}`;
  return apiClient.get<MenuListResponse>(endpoint);
}
