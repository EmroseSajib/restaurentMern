import { NextResponse } from "next/server";

export function proxy(req) {
  const pathname = req.nextUrl.pathname;

  // allow login page
  if (pathname === "/admin/login") return NextResponse.next();

  // protect admin routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin_access_token")?.value;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
