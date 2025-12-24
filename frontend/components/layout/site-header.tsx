"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { Menu, ShoppingBag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { LanguageSwitcher } from "./language-switcher"
import { PageContainer } from "./page-container"
import { useCart } from "@/hooks/use-cart"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { cn } from "@/lib/utils"
import type { Locale } from "@/i18n/config"

interface SiteHeaderProps {
  locale: Locale
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const { itemCount, isLoaded } = useCart()
  const { isAuthenticated } = useAdminAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/menu", label: t("nav.menu") },
    { href: "/reservations", label: t("nav.reservations") },
    { href: "/catering", label: t("nav.catering") },
    { href: "/gift-vouchers", label: t("nav.giftVouchers") },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent",
      )}
    >
      <PageContainer size="wide">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-sans text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors"
          >
            dekleineman
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(link.href) ? "text-primary" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher currentLocale={locale} />

            {/* Cart Button */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {isLoaded && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Admin Button */}
            <Link href={isAuthenticated ? "/admin/dashboard" : "/admin/login"}>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline ml-2">
                  {isAuthenticated ? t("admin.dashboard") : t("common.adminLogin")}
                </span>
              </Button>
            </Link>

            {/* CTA Button */}
            <Link href="/menu" className="hidden sm:block">
              <Button>{t("common.orderNow")}</Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        isActive(link.href) ? "text-primary" : "text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-6 border-t">
                    <Link href="/menu" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full">{t("common.orderNow")}</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </PageContainer>
    </header>
  )
}
