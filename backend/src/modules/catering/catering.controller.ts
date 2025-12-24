import type { Request, Response } from "express";
import type { AuthedAdminRequest } from "../../middlewares/auth.middleware";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  adminListCateringRequests,
  adminUpdateCateringStatus,
  createCateringRequest,
} from "./catering.service";
import {
  cateringIdParamSchema,
  createCateringRequestSchema,
  listCateringQuerySchema,
  updateCateringStatusSchema,
} from "./catering.validation";

export const postCateringRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = createCateringRequestSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Invalid input");

    const data = await createCateringRequest(parsed.data);
    res.status(201).json({ success: true, data });
  }
);

export const getAdminCatering = asyncHandler(
  async (req: AuthedAdminRequest, res: Response) => {
    const parsed = listCateringQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new ApiError(400, "Invalid query");

    const data = await adminListCateringRequests(parsed.data as any);
    res.json({ success: true, data });
  }
);

export const patchAdminCateringStatus = asyncHandler(
  async (req: AuthedAdminRequest, res: Response) => {
    const idParsed = cateringIdParamSchema.safeParse(req.params);
    if (!idParsed.success) throw new ApiError(400, "Invalid id");

    const bodyParsed = updateCateringStatusSchema.safeParse(req.body);
    if (!bodyParsed.success) throw new ApiError(400, "Invalid input");

    const data = await adminUpdateCateringStatus(
      idParsed.data.id,
      bodyParsed.data.status
    );
    res.json({ success: true, data });
  }
);
