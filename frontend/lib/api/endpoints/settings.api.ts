import { apiClient, type ApiResponse } from "../client";
import { getStoredAccessToken } from "./auth.api";

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface HoursRange {
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
}

export interface DayHours {
  isClosed: boolean;
  ranges: HoursRange[];
}

export type WeeklyHours = Record<DayKey, DayHours>;

export interface RestaurantInfo {
  name: string;
  cuisine: string;
  address: string;
  phone: string;
  country: string;
}

export interface FulfillmentSettings {
  deliveryEnabled: boolean;
  pickupEnabled: boolean;
  minOrderAmount: number; // cents
}

export interface SettingsPayload {

  restaurant: RestaurantInfo;
  fulfillment: FulfillmentSettings;
  openingHours: WeeklyHours;
  deliveryHours: WeeklyHours;
  // optional future field; backend may not have it yet
  occasionDiscounts?: OccasionDiscount[];
  updatedAt: string;
}


export interface OccasionDiscount {
  id?: string;
  name: string;
  description: string;
  discountPercentage: number;
  startDate?: string;
  endDate?: string;
}

export async function getSettings(): Promise<ApiResponse<SettingsPayload>> {
  return apiClient.get<ApiResponse<SettingsPayload>>("/settings");
}

export async function getOpeningHours(): Promise<
  ApiResponse<{ openingHours: WeeklyHours; deliveryHours: WeeklyHours }>
> {
  return apiClient.get<ApiResponse<{ openingHours: WeeklyHours; deliveryHours: WeeklyHours }>>(
    "/settings/opening-hours"
  );
}

export async function getActiveDiscounts(): Promise<ApiResponse<OccasionDiscount[]>> {
  // Best-effort: try reading from /settings; if absent, return empty array.
  const s = await getSettings();
  const discounts = Array.isArray((s.data as any)?.occasionDiscounts) ? ((s.data as any).occasionDiscounts as OccasionDiscount[]) : [];
  return { success: true, data: discounts };
}

export async function getDashboardStats(): Promise<ApiResponse<any>> {
  const token = getStoredAccessToken();
  return apiClient.get<ApiResponse<any>>("/admin/dashboard/stats", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function updateSettings(input: Omit<SettingsPayload, "updatedAt">): Promise<ApiResponse<SettingsPayload>> {
  const token = getStoredAccessToken();
  return apiClient.put<ApiResponse<SettingsPayload>>("/settings/admin", input, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
