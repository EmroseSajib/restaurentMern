import type { Request, Response } from "express";
import type { AuthedAdminRequest } from "../../middlewares/auth.middleware";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { adminCreateVoucher, validateVoucher } from "./voucher.service";
import {
  validateVoucherSchema,
  voucherCreateSchema,
} from "./voucher.validation";

export const postValidateVoucher = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = validateVoucherSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Invalid input");

    const data = await validateVoucher(parsed.data);
    res.json({ success: true, data });
  }
);

export const postCreateVoucher = asyncHandler(
  async (req: AuthedAdminRequest, res: Response) => {
    const parsed = voucherCreateSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Invalid input");

    const data = await adminCreateVoucher(parsed.data);
    res.status(201).json({ success: true, data });
  }
);
