import bcrypt from "bcrypt";
import {
  sha256,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../config/auth";
import { AdminModel } from "../../models/Admin.model";
import { AdminRefreshTokenModel } from "../../models/AdminRefreshToken.model";
import { ApiError } from "../../utils/apiError";

const REFRESH_TTL_DAYS = 7; // should align with JWT_REFRESH_EXPIRES_IN

function calcRefreshExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + REFRESH_TTL_DAYS);
  return d;
}

export async function loginAdmin(params: {
  username: string;
  password: string;
  userAgent?: string | null;
  ip?: string | null;
}) {
  const admin = await AdminModel.findOne({ username: params.username }).lean();
  if (!admin || !admin.isActive) throw new ApiError(401, "Invalid credentials");

  const ok = await bcrypt.compare(params.password, admin.passwordHash);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const payload = { sub: String(admin._id), role: "admin" as const };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const tokenHash = sha256(refreshToken);

  await AdminRefreshTokenModel.create({
    adminId: admin._id,
    tokenHash,
    expiresAt: calcRefreshExpiry(),
    userAgent: params.userAgent ?? null,
    ip: params.ip ?? null,
  });

  return {
    admin: {
      id: String(admin._id),
      username: admin.username,
      role: admin.role,
    },
    accessToken,
    refreshToken, // we’ll set cookie in controller; you can also return it if you want
  };
}

export async function refreshAdminSession(params: {
  refreshToken: string;
  userAgent?: string | null;
  ip?: string | null;
}) {
  let payload;
  try {
    payload = verifyRefreshToken(params.refreshToken);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const oldHash = sha256(params.refreshToken);

  const stored = await AdminRefreshTokenModel.findOne({ tokenHash: oldHash });
  if (!stored) throw new ApiError(401, "Refresh token not recognized");
  if (stored.revokedAt) throw new ApiError(401, "Refresh token revoked");
  if (stored.expiresAt.getTime() < Date.now())
    throw new ApiError(401, "Refresh token expired");

  // rotation
  const newAccessToken = signAccessToken({ sub: payload.sub, role: "admin" });
  const newRefreshToken = signRefreshToken({ sub: payload.sub, role: "admin" });
  const newHash = sha256(newRefreshToken);

  stored.revokedAt = new Date();
  stored.replacedByTokenHash = newHash;
  await stored.save();

  await AdminRefreshTokenModel.create({
    adminId: payload.sub,
    tokenHash: newHash,
    expiresAt: calcRefreshExpiry(),
    userAgent: params.userAgent ?? null,
    ip: params.ip ?? null,
  });

  const admin = await AdminModel.findById(payload.sub).lean();
  if (!admin || !admin.isActive) throw new ApiError(401, "Admin not found");

  return {
    admin: {
      id: String(admin._id),
      username: admin.username,
      role: admin.role,
    },
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logoutAdminSession(refreshToken: string) {
  const hash = sha256(refreshToken);
  await AdminRefreshTokenModel.updateOne(
    { tokenHash: hash, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
}
