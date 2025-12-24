import type { Response } from "express";
import type { AuthedAdminRequest } from "../../middlewares/auth.middleware";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  adminGetOrder,
  adminListOrders,
  adminUpdateOrderStatus,
} from "./adminOrders.service";
import {
  listOrdersQuerySchema,
  orderIdParamSchema,
  updateOrderStatusSchema,
} from "./adminOrders.validation";
import { getDashboardStats } from "./dashboard.service";

export const getAdminOrders = asyncHandler(
  async (req: AuthedAdminRequest, res: Response) => {
    const parsed = listOrdersQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new ApiError(400, "Invalid query");

    const data = await adminListOrders(parsed.data as any);
    res.json({ success: true, data });
  }
);

export const getAdminOrder = asyncHandler(
  async (req: AuthedAdminRequest, res: Response) => {
    const parsed = orderIdParamSchema.safeParse(req.params);
    if (!parsed.success) throw new ApiError(400, "Invalid id");

    const data = await adminGetOrder(parsed.data.id);
    res.json({ success: true, data });
  }
);

export const patchAdminOrderStatus = asyncHandler(
  async (req: AuthedAdminRequest, res: Response) => {
    const idParsed = orderIdParamSchema.safeParse(req.params);
    if (!idParsed.success) throw new ApiError(400, "Invalid id");

    const bodyParsed = updateOrderStatusSchema.safeParse(req.body);
    if (!bodyParsed.success) throw new ApiError(400, "Invalid input");

    const data = await adminUpdateOrderStatus(
      idParsed.data.id,
      bodyParsed.data.status
    );
    res.json({ success: true, data });
  }
);

export const getAdminDashboardStats = asyncHandler(
  async (_req: AuthedAdminRequest, res: Response) => {
    const data = await getDashboardStats();
    res.json({ success: true, data });
  }
);
