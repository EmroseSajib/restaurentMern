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

  // If login failed, just return error to client
  if (!res.ok || !data?.success) {
    return NextResponse.json(
      data ?? { success: false, message: "Login failed" },
      {
        status: res.status || 401,
      }
    );
  }

  const token = data?.data?.accessToken;

  // Return response AND set token as httpOnly cookie
  const response = NextResponse.json(
    {
      success: true,
      admin: data.data.admin, // send admin info to client if you want
    },
    { status: 200 }
  );

  // httpOnly cookie = not accessible from JS (secure)
  response.cookies.set("admin_access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // optional: set maxAge to match your JWT expiry (example: 1 day)
    maxAge: 60 * 60 * 24,
  });

  return response;
}
