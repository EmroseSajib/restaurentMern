"use client"

import { useTranslations } from "next-intl"
import { Menu, LogOut } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { NotificationDropdown } from "./notification-dropdown"
import { AdminSidebar } from "./admin-sidebar"
import { useAdminAuth } from "@/hooks/use-admin-auth"

export function AdminTopbar() {
  const t = useTranslations("admin")
  const { user, logout } = useAdminAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
            <AdminSidebar />
          </SheetContent>
        </Sheet>
        <h1 className="font-sans text-lg font-semibold hidden sm:block">{t("dashboard")}</h1>
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.username}</span>
          <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t("logout")}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
