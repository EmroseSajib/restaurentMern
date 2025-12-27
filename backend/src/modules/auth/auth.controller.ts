import type { Request, Response } from "express";
import { env } from "../../config/env";
import type { AuthedAdminRequest } from "../../middlewares/auth.middleware";
import { AdminModel } from "../../models/Admin.model";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";

import {
  loginAdmin,
  logoutAdminSession,
  refreshAdminSession,
} from "./auth.service";
import { adminLoginSchema } from "./auth.validation";
import console = require("console");

const cookieName = process.env.COOKIE_NAME_ADMIN_REFRESH ?? "adminRefresh";

function setRefreshCookie(res: Response, refreshToken: string) {
  const isProd = env.NODE_ENV === "production";

  res.cookie(cookieName, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/v1/admin/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res: Response) {
  const isProd = env.NODE_ENV === "production";
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/v1/admin/auth/refresh",
  });
}

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  console.log("Parsed data=======>>>>", req.body);
  const parsed = adminLoginSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Invalid input");

  const result = await loginAdmin({
    ...parsed.data,
    userAgent: req.headers["user-agent"] ?? null,
    ip: req.ip ?? null,
  });

  setRefreshCookie(res, result.refreshToken);

  res.json({
    success: true,
    data: {
      admin: result.admin,
      accessToken: result.accessToken,
    },
  });
});

export const adminRefresh = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies?.[cookieName] ||
      (typeof req.body?.refreshToken === "string"
        ? req.body.refreshToken
        : null);

    if (!refreshToken) throw new ApiError(401, "Missing refresh token");

    const result = await refreshAdminSession({
      refreshToken,
      userAgent: req.headers["user-agent"] ?? null,
      ip: req.ip ?? null,
    });

    setRefreshCookie(res, result.refreshToken);

    res.json({
      success: true,
      data: {
        admin: result.admin,
        accessToken: result.accessToken,
      },
    });
  }
);
export const adminMe = asyncHandler(
  async (req: AuthedAdminRequest, res: Response) => {
    if (!req.admin?.id) throw new ApiError(401, "Unauthorized");

    const admin = await AdminModel.findById(req.admin.id).lean();
    if (!admin || !admin.isActive) throw new ApiError(401, "Unauthorized");

    res.json({
      success: true,
      data: {
        admin: {
          id: String(admin._id),
          username: admin.username,
          role: admin.role,
        },
      },
    });
  }
);
export const adminLogout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[cookieName];
  if (refreshToken) {
    await logoutAdminSession(refreshToken);
  }
  clearRefreshCookie(res);

  res.json({ success: true, data: { ok: true } });
});
