import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { CateringService } from "./catering.service";
export const CateringController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      await CateringService.sendEmailToAdmin(req.body);
      return res.json({ success: true, message: "Request received" });
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        message: e.message || "Failed to send email",
      });
    }
  },
);
