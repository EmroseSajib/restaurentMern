import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth.middleware";
import {
  getOpeningHours,
  getSettings,
  putAdminSettings,
} from "./settings.controller";

const router = Router();

// Public
router.get("/", getSettings);
router.get("/opening-hours", getOpeningHours);

// Admin
router.put("/admin", requireAdmin, putAdminSettings);

export default router;
