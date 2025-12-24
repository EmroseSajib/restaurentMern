import type { Request, Response } from "express";
import type { AuthedAdminRequest } from "../../middlewares/auth.middleware";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { adminUpdateSettings, getPublicSettings } from "./settings.service";
import { updateSettingsSchema } from "./settings.validation";

export const getSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    const data = await getPublicSettings();
    res.json({ success: true, data });
  }
);

export const getOpeningHours = asyncHandler(
  async (_req: Request, res: Response) => {
    const data = await getPublicSettings();
    res.json({
      success: true,
      data: {
        openingHours: data.openingHours,
        deliveryHours: data.deliveryHours,
      },
    });
  }
);

export const putAdminSettings = asyncHandler(
  async (req: AuthedAdminRequest, res: Response) => {
    const parsed = updateSettingsSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Invalid input");

    const data = await adminUpdateSettings(parsed.data);
    res.json({ success: true, data });
  }
);
