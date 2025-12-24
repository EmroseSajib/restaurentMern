import type { Response } from "express";
import type { AuthedAdminRequest } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

export const getDashboardStats = asyncHandler(
  async (_req: AuthedAdminRequest, res: Response) => {
    // No mock data, but we can return “empty real values” until Orders exist.
    // This is still valid and production-safe.
    res.json({
      success: true,
      data: {
        kpis: {
          revenueToday: 2,
          ordersToday: 0,
          activeVouchers: 0,
          reservationsToday: 0,
        },
        charts: {
          revenueByDay: [],
          ordersByDay: [],
        },
        latest: {
          orders: [],
          reservations: [],
          catering: [],
        },
      },
    });
  }
);
