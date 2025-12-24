import type { Request, Response } from "express";
import type { AuthedAdminRequest } from "../../middlewares/auth.middleware";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  adminCreateCategory,
  adminCreateMenuItem,
  listCategories,
  listMenu,
} from "./menu.service";
import {
  categoryCreateSchema,
  menuItemCreateSchema,
  menuQuerySchema,
} from "./menu.validation";

export const getCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const data = await listCategories();
    res.json({ success: true, data });
  }
);

export const getMenu = asyncHandler(async (req: Request, res: Response) => {
  const parsed = menuQuerySchema.safeParse(req.query);
  if (!parsed.success) throw new ApiError(400, "Invalid query");

  const data = await listMenu(parsed.data as any);
  res.json({ success: true, data });
});

export const createCategory = asyncHandler(
  async (req: AuthedAdminRequest, res: Response) => {
    const parsed = categoryCreateSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Invalid input");

    const data = await adminCreateCategory(parsed.data);
    res.status(201).json({ success: true, data });
  }
);

export const createMenuItem = asyncHandler(
  async (req: AuthedAdminRequest, res: Response) => {
    const parsed = menuItemCreateSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Invalid input");

    const data = await adminCreateMenuItem(parsed.data);
    res.status(201).json({ success: true, data });
  }
);
