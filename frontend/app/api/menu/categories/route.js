import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.API_BASE_URL;

  const url = new URL("/v1/menu/categories", base);
  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}
