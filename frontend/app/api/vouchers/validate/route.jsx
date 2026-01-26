import { NextResponse } from "next/server";

export async function POST(req) {
  const base = process.env.API_BASE_URL; // http://localhost:4000
  const body = await req.json();

  const url = new URL("/v1/vouchers/validate", base);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
