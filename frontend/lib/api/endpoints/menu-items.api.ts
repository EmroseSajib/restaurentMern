import { apiClient, type ApiResponse } from "../client";
import { getStoredAccessToken } from "./auth.api";

export type LocalizedText = { en: string; nl: string; de: string };

export type MenuItem = {
  id: string;
  categoryId: string;

  name: LocalizedText;
  description: LocalizedText;

  price: number;

  available: boolean;
  isMainDish: boolean;

  spicy: boolean;
  nuts: boolean;
  glutenFree: boolean;
  vegetarian: boolean;
  vegan: boolean;

  imageUrl?: string;

  createdAt?: string;
  updatedAt?: string;
};

export type CreateMenuItemInput = {
  categoryId: string;

  name: LocalizedText;
  description: LocalizedText;

  price: Money;

  available: boolean;
  isMainDish: boolean;

  spicy: boolean;
  nuts: boolean;
  glutenFree: boolean;
  vegetarian: boolean;
  vegan: boolean;

  imageUrl?: string;
};

function authHeaders() {
  const token = getStoredAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getMenuItems(): Promise<ApiResponse<MenuItem[]>> {
  return apiClient.get<ApiResponse<MenuItem[]>>("/menu/items", {
    headers: authHeaders(),
  });
}

export async function createMenuItem(
  input: CreateMenuItemInput
): Promise<ApiResponse<MenuItem>> {
  return apiClient.post<ApiResponse<MenuItem>>("/menu/items", input, {
    headers: authHeaders(),
  });
}
