import type { Request, Response } from "express";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { validateMembership } from "./membership.service";
import { validateMembershipSchema } from "./membership.validation";

export const postValidateMembership = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = validateMembershipSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Invalid input");

    const data = await validateMembership(parsed.data);
    res.json({ success: true, data });
  }
);
