"use server";

import { updateTag } from "next/cache"; // New in Next.js 16 for instant revalidation
import { cookies } from "next/headers";

export async function createVoucher(voucherData) {
  // NEXT.JS 16 REQUIREMENT: cookies() is now an async function
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access_token")?.value;
  console.log("Voucher Data:", voucherData);
  if (!token) {
    return { error: "Session expired. Please log in again." };
  }

  try {
    const response = await fetch("http://localhost:4000/v1/vouchers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(voucherData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Server Error" };
    }

    // Next.js 16 optimization: triggers immediate refresh for the 'vouchers' tag
    updateTag("vouchers");

    return { success: true, data };
  } catch (err) {
    return { error: "Could not connect to the API server." };
  }
}
