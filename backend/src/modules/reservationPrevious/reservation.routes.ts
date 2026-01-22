import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth.middleware";
import {
  getAdminReservations,
  patchAdminReservationStatus,
  postReservation,
} from "./reservation.controller";

const router = Router();

// Public
router.post("/", postReservation);

// Admin
router.get("/admin", requireAdmin, getAdminReservations);
router.patch("/admin/:id/status", requireAdmin, patchAdminReservationStatus);

export default router;
