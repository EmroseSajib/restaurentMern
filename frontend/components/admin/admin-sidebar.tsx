"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { LayoutDashboard, ShoppingBag, CalendarDays, ChefHat, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const t = useTranslations("admin")
  const pathname = usePathname()
  const { logout } = useAdminAuth()

  const navItems = [
    { href: "/admin/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/admin/orders", label: t("orders"), icon: ShoppingBag },
    { href: "/admin/reservations", label: t("reservations"), icon: CalendarDays },
    { href: "/admin/catering", label: t("catering"), icon: ChefHat },
    { href: "/admin/settings", label: t("settings"), icon: Settings },
  ]

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar text-sidebar-foreground hidden lg:flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="font-sans text-xl font-bold">
          dekleineman
        </Link>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Admin Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          <span>{t("logout")}</span>
        </Button>
      </div>
    </aside>
  )
}
