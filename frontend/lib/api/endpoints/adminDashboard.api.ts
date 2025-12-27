import { apiClient, type ApiResponse } from "../client";
import { getStoredAccessToken } from "./auth.api"; // or wherever you store token

export type Money = { amount: number; currency: string };

export type DashboardStats = {
  kpis: {
    revenueToday: number; // cents
    ordersToday: number;
    reservationsToday: number;
    cateringToday: number;
  };
  charts: {
    revenueByDay: { date: string; amount: number }[]; // cents
    ordersByDay: { date: string; count: number }[];
  };
  latest: {
    orders: any[];
    reservations: any[];
    catering: any[];
  };
};

export async function getDashboardStats(): Promise<
  ApiResponse<DashboardStats>
> {
  const token = getStoredAccessToken();
  return apiClient.get<ApiResponse<DashboardStats>>("/admin/dashboard/stats", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
