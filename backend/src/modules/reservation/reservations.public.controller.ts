import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { ReservationsService } from "./reservations.public.service";

export const createReservationRequest = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      await ReservationsService.sendReservationEmail(req.body);
      return res.json({ success: true, message: "Request received" });
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        message: e.message || "Failed to send email",
      });
    }
  },
);
