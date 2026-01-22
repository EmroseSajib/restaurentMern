import { Router } from "express";
import { createReservationRequest } from "./reservations.public.controller";

const router = Router();

// POST /v1/reservations/request
router.post("/request", createReservationRequest);

export default router;
