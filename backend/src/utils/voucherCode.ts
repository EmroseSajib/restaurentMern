import crypto from "crypto";

export function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

// 6-20 chars A-Z 0-9 -
export function isValidCustomCode(code: string) {
  const c = normalizeCode(code);
  return /^[A-Z0-9-]{6,20}$/.test(c);
}

export function generateVoucherCode() {
  const part = crypto.randomBytes(6).toString("base64url").toUpperCase();
  return `GV-${part}`;
}
