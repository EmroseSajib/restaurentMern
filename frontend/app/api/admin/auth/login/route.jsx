import { NextResponse } from "next/server";

export async function POST(req) {
  const base = process.env.API_BASE_URL;
  const body = await req.json();

  const url = new URL("/v1/admin/auth/login", base);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    return NextResponse.json(
      data ?? { success: false, message: "Login failed" },
      { status: res.status || 401 }
    );
  }

  const token = data?.data?.accessToken;

  // ✅ send token to client so client can store in localStorage
  return NextResponse.json(
    {
      success: true,
      token,
      admin: data.data.admin,
    },
    { status: 200 }
  );
}
