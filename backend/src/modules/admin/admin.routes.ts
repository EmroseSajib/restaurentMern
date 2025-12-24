import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth.middleware";
import { pusherAuth } from "./pusher.controller";

const router = Router();

// router.get("/dashboard/stats", requireAdmin, getDashboardStats);
router.post("/pusher/auth", requireAdmin, pusherAuth);

export default router;
