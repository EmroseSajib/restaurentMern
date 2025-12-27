"use client";

import { useAdminAuth } from "@/app/context/admin-auth-context";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { RealtimeProvider } from "@/components/admin/realtime-provider";
// import { useAdminAuth } from "@/hooks/use-admin-auth";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAdminAuth();
  console.log("isAuthenticated======>>>", isAuthenticated);

  // ✅ IMPORTANT FIX
  const isLoginPage = pathname.endsWith("/admin/login");

  useEffect(() => {
    if (isLoading) return;

    // not logged in → redirect to login
    if (!isAuthenticated && !isLoginPage) {
      router.replace("/admin/login");
      return;
    }

    // logged in → prevent staying on login
    if (isAuthenticated && isLoginPage) {
      router.replace("/admin");
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  if (isLoading) return null;

  // show ONLY login page (no sidebar/topbar)
  if (!isAuthenticated && isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  return (
    <RealtimeProvider>
      <div className="min-h-screen bg-muted">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminTopbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </RealtimeProvider>
  );
}
