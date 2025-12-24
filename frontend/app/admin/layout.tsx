"use client";

import type React from "react";

import { AdminLayout as AdminLayoutComponent } from "@/components/layout/admin-layout";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth } = useAdminAuth();
  const [checked, setChecked] = useState(false);

  // useEffect(() => {
  //   const verify = async () => {
  //     await checkAuth();
  //     setChecked(true);
  //   };
  //   verify();
  // }, [checkAuth]);

  // useEffect(() => {
  //   if (checked && !isLoading) {
  //     const isLoginPage = pathname === "/admin/login";
  //     if (!isAuthenticated && !isLoginPage) {
  //       router.push("/admin/login");
  //     } else if (isAuthenticated && isLoginPage) {
  //       router.push("/admin");
  //     }
  //   }
  // }, [checked, isLoading, isAuthenticated, pathname, router]);

  // Show loading while checking auth
  // if (!checked || isLoading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //     </div>
  //   );
  // }

  // Login page doesn't need the admin layout wrapper
  // if (pathname === "/admin/login") {
  //   return children;
  // }

  // Protected routes get the full admin layout
  // if (!isAuthenticated) {
  //   return null;
  // }

  return <AdminLayoutComponent>{children}</AdminLayoutComponent>;
}
