"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/hooks/use-admin-auth"

export function AdminLoginButton() {
  const t = useTranslations()
  const { isAuthenticated } = useAdminAuth()

  return (
    <Link href={isAuthenticated ? "/admin/dashboard" : "/admin/login"}>
      <Button variant="ghost" size="sm" className="gap-2">
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">{isAuthenticated ? t("admin.dashboard") : t("common.adminLogin")}</span>
      </Button>
    </Link>
  )
}
