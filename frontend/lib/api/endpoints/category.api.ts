import { apiClient, type ApiResponse } from "../client";
import { getStoredAccessToken } from "./auth.api";

export type LocalizedName = {
  en: string;
  nl: string;
  de: string;
};

export type MenuCategory = {
  id: string;
  name: LocalizedName; // ✅ was string
  slug: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCategoryInput = {
  name: LocalizedName; // ✅ required 3 languages
  slug: string; // ✅ required
  sortOrder: number; // ✅ required
  isActive: boolean; // ✅ required
};

function authHeaders() {
  const token = getStoredAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getCategories(): Promise<ApiResponse<MenuCategory[]>> {
  return apiClient.get<ApiResponse<MenuCategory[]>>("/menu/categories", {
    headers: authHeaders(),
  });
}

export async function createCategory(
  input: CreateCategoryInput
): Promise<ApiResponse<MenuCategory>> {
  return apiClient.post<ApiResponse<MenuCategory>>("/menu/categories", input, {
    headers: authHeaders(),
  });
}
