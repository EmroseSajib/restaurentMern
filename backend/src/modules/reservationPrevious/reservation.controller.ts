import type { Request, Response } from "express";
import type { AuthedAdminRequest } from "../../middlewares/auth.middleware";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  adminListReservations,
  adminUpdateReservationStatus,
  createReservation,
} from "./reservation.service";
import {
  createReservationSchema,
  listReservationsQuerySchema,
  reservationIdParamSchema,
  updateReservationStatusSchema,
} from "./reservation.validation";

export const postReservation = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = createReservationSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Invalid input");

    const data = await createReservation(parsed.data);
    res.status(201).json({ success: true, data });
  }
);

export const getAdminReservations = asyncHandler(
  async (req: AuthedAdminRequest, res: Response) => {
    const parsed = listReservationsQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new ApiError(400, "Invalid query");

    const data = await adminListReservations(parsed.data as any);
    res.json({ success: true, data });
  }
);

export const patchAdminReservationStatus = asyncHandler(
  async (req: AuthedAdminRequest, res: Response) => {
    const idParsed = reservationIdParamSchema.safeParse(req.params);
    if (!idParsed.success) throw new ApiError(400, "Invalid id");

    const bodyParsed = updateReservationStatusSchema.safeParse(req.body);
    if (!bodyParsed.success) throw new ApiError(400, "Invalid input");

    const data = await adminUpdateReservationStatus(
      idParsed.data.id,
      bodyParsed.data.status
    );
    res.json({ success: true, data });
  }
);
