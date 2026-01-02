import { NextResponse } from "next/server";

export async function GET(req) {
  const base = process.env.API_BASE_URL;
  const { searchParams } = new URL(req.url);

  const url = new URL("/v1/menu", base);
  searchParams.forEach((v, k) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}
