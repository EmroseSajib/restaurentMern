"use client";
export async function validateVoucherApi(payload) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  console.log("API BASE:", base);

  if (!base) {
    return {
      ok: false,
      message: "API base URL not configured",
    };
  }

  const res = await fetch(`${base}/v1/gift-vouchers/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      ok: false,
      message: data?.message || "Voucher validation failed",
      data,
    };
  }

  return { ok: true, data };
}
