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
  // ✅ create response and set cookie
  const response = NextResponse.json(
    { success: true, admin: data?.data?.admin }, // you can also include token if you want
    { status: 200 }
  );

  response.cookies.set("admin_access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
  return response;
}
