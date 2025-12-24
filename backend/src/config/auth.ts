import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "./env";

export type AdminJwtPayload = {
  sub: string; // adminId
  role: "admin";
};

export function signAccessToken(payload: AdminJwtPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
}

export function signRefreshToken(payload: AdminJwtPayload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AdminJwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as AdminJwtPayload;
}

export function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
