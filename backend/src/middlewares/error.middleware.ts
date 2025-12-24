import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err instanceof ApiError ? err.status : 500;
  const message = err?.message ?? "Server error";

  if (status >= 500) console.error(err);

  res.status(status).json({
    success: false,
    message,
    code: err?.code,
  });
}
