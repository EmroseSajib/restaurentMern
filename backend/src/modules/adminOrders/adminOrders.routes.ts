import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth.middleware";
import {
  getAdminDashboardStats,
  getAdminOrder,
  getAdminOrders,
  patchAdminOrderStatus,
} from "./adminOrders.controller";

const router = Router();

router.get("/dashboard/stats", requireAdmin, getAdminDashboardStats);
router.get("/orders", requireAdmin, getAdminOrders);
router.get("/orders/:id", requireAdmin, getAdminOrder);
router.patch("/orders/:id/status", requireAdmin, patchAdminOrderStatus);

export default router;
