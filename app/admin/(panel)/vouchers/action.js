import { cookies } from "next/headers";

export async function getVouchers() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access_token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }
  const base = process.env.API_BASE_URL;
  const url = new URL("/v1/vouchers", base);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Failed to fetch vouchers");
  }

  return data.data;
}
