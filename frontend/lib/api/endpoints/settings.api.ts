import { apiClient, type ApiResponse } from "../client"

export interface OpeningHoursDay {
  day: string
  open: string
  close: string
  closed: boolean
}

export interface DeliveryHours {
  day: string
  open: string
  close: string
  isAvailable: boolean
}

export interface OccasionDiscount {
  _id: string
  name: string
  description: string
  discountPercentage: number
  startDate: string
  endDate: string
  isActive: boolean
}

export interface RestaurantSettings {
  restaurantName: string
  contactEmail: string
  contactPhone: string
  acceptingOrders: boolean
  minimumOrderAmount: number
  deliveryFee: number
  freeDeliveryThreshold: number
  estimatedDeliveryTime: string
  estimatedPickupTime: string
  deliveryEnabled: boolean
  pickupEnabled: boolean
  openingHours: OpeningHoursDay[]
  deliveryHours: DeliveryHours[]
}

export interface DashboardStats {
  totalOrders: number
  todayOrders: number
  revenue: number
  todayRevenue: number
  pendingOrders: number
  totalReservations: number
  todayReservations: number
}

async function getSettings(): Promise<RestaurantSettings> {
  const response = await apiClient.get<ApiResponse<RestaurantSettings>>("/settings")
  return response.data
}

async function getOpeningHours(): Promise<OpeningHoursDay[]> {
  const response = await apiClient.get<ApiResponse<OpeningHoursDay[]>>("/settings/opening-hours")
  return response.data
}

async function getDeliveryHours(): Promise<DeliveryHours[]> {
  const response = await apiClient.get<ApiResponse<DeliveryHours[]>>("/settings/delivery-hours")
  return response.data
}

async function getActiveDiscounts(): Promise<OccasionDiscount[]> {
  const response = await apiClient.get<ApiResponse<OccasionDiscount[]>>("/settings/discounts/active")
  return response.data
}

async function getDashboardStats(): Promise<DashboardStats> {
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null
  const response = await apiClient.get<ApiResponse<DashboardStats>>("/admin/dashboard/stats", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return response.data
}

async function updateSettings(settings: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null
  const response = await apiClient.put<ApiResponse<RestaurantSettings>>("/admin/settings", settings, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return response.data
}

export const settingsApi = {
  getSettings,
  getOpeningHours,
  getDeliveryHours,
  getActiveDiscounts,
  getDashboardStats,
  updateSettings,
}
