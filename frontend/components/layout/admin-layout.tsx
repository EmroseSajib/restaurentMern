"use client";

import type React from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { RealtimeProvider } from "@/components/admin/realtime-provider";
import { Spinner } from "@/components/ui/spinner";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const t = useTranslations("admin");
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // if (!isAuthenticated) {
  //   return null
  // }

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
