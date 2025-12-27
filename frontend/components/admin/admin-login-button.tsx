"use client";

import { useAdminAuth } from "@/app/context/admin-auth-context";
import { Button } from "@/components/ui/button";
// import { useAdminAuth } from "@/hooks/use-admin-auth";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function AdminLoginButton() {
  const t = useTranslations();
  const { isAuthenticated } = useAdminAuth();

  return (
    <Link href={isAuthenticated ? "/admin" : "/admin/login"}>
      <Button variant="ghost" size="sm" className="gap-2">
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">
          {isAuthenticated ? t("admin.dashboard") : t("common.adminLogin")}
        </span>
      </Button>
    </Link>
  );
}
