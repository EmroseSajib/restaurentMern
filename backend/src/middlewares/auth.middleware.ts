import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../config/auth";
import { ApiError } from "../utils/apiError";

export type AuthedAdminRequest = Request & {
  admin?: { id: string; role: "admin" };
};

export function requireAdmin(
  req: AuthedAdminRequest,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new ApiError(401, "Missing access token");

  try {
    const payload = verifyAccessToken(token);
    req.admin = { id: payload.sub, role: "admin" };
    next();
  } catch {
    next(new ApiError(401, "Invalid access token"));
  }
}
