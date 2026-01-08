import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_access_token")?.value;
  const base = process.env.API_BASE_URL;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
const url = new URL("/v1/vouchers", base);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
