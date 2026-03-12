// "use client";
// export async function validateVoucherApi(payload) {
//   const base = process.env.NEXT_PUBLIC_API_BASE_URL;

//   console.log("API BASE:", base);

//   if (!base) {
//     return {
//       ok: false,
//       message: "API base URL not configured",
//     };
//   }

//   const res = await fetch(`${base}/v1/gift-vouchers/validate`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   const data = await res.json().catch(() => null);

//   if (!res.ok) {
//     return {
//       ok: false,
//       message: data?.message || "Voucher validation failed",
//       data,
//     };
//   }

//   return { ok: true, data };
// }
export async function validateVoucherApi({ code, subtotalAmount }) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000";

    const res = await fetch(`${base}/v1/gift-vouchers/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, subtotalAmount }),
    });

    const json = await res.json().catch(() => null);

    // 🔑 Handle HTTP errors here
    if (!res.ok) {
      return {
        ok: false,
        message: json?.message || "Voucher validation failed",
        data: json,
      };
    }

    return {
      ok: true,
      data: json?.data,
    };
  } catch (err) {
    // Only network / runtime errors reach here
    return {
      ok: false,
      message: "Failed to validate voucher (network error)",
    };
  }
}
