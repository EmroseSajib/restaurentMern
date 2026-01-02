export async function validateVoucherApi({ code, subtotalAmount, currency }) {
  const res = await fetch("/api/vouchers/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, subtotalAmount, currency }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // backend might send {message: "..."} or {error:"..."}
    const msg = data?.message || data?.error || "Voucher validation failed";
    return { ok: false, message: msg, data };
  }

  return { ok: true, data };
}
