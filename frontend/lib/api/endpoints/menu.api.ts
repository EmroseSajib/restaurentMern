import { apiClient, type ApiResponse } from "../client"

export interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  isSpicy: boolean
  containsNuts: boolean
  isMainDish: boolean
  isAvailable: boolean
  allergens?: string[]
}

export interface MenuCategory {
  _id: string
  name: string
  description?: string
  sortOrder: number
}

export async function getMenu(): Promise<ApiResponse<MenuItem[]>> {
  return apiClient.get<ApiResponse<MenuItem[]>>("/menu")
}

export async function getMenuByCategory(categoryId: string): Promise<ApiResponse<MenuItem[]>> {
  return apiClient.get<ApiResponse<MenuItem[]>>(`/menu/category/${categoryId}`)
}

export async function getCategories(): Promise<ApiResponse<MenuCategory[]>> {
  return apiClient.get<ApiResponse<MenuCategory[]>>("/menu/categories")
}

export async function getMenuItem(id: string): Promise<ApiResponse<MenuItem>> {
  return apiClient.get<ApiResponse<MenuItem>>(`/menu/${id}`)
}

export async function searchMenu(query: string): Promise<ApiResponse<MenuItem[]>> {
  return apiClient.get<ApiResponse<MenuItem[]>>(`/menu/search?q=${encodeURIComponent(query)}`)
}
