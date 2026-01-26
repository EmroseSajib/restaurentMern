export function normalizeVoucherCode(input: string) {
  return String(input || "")
    .trim()
    .toUpperCase();
}
