import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth.middleware";
import {
  getAdminCatering,
  patchAdminCateringStatus,
  postCateringRequest,
} from "./catering.controller";

const router = Router();

// Public
router.post("/", postCateringRequest);

// Admin
router.get("/admin", requireAdmin, getAdminCatering);
router.patch("/admin/:id/status", requireAdmin, patchAdminCateringStatus);

export default router;
