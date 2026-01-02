"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShieldPlus } from "lucide-react";

import { restaurantInfo } from "@/lib/data/restaurant";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/translations";
import { useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";
import { Globe, Menu, Phone, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const languages: { code: Locale; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { locale, setLocale, t } = useI18n();
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/menu", label: t.nav.menu },
    { href: "/order", label: t.nav.order },
    { href: "/reservation", label: t.nav.reservation },
    { href: "/gift-voucher", label: t.nav.giftVoucher },
    { href: "/about", label: t.nav.about },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[1];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg"
          : "md:bg-transparent bg-white/95 "
      )}
    >
      {/* Top bar with contact */}
      <div className="hidden lg:block bg-amber-900 text-amber-50 text-sm py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a
              href={`tel:${restaurantInfo.contact.phone}`}
              className="flex items-center gap-1 hover:text-amber-200 transition-colors"
            >
              <Phone className="h-3 w-3" />
              {restaurantInfo.contact.phoneFormatted}
            </a>
            <span className="text-amber-400">|</span>
            <span>{restaurantInfo.address.full}</span>
          </div>
          <div className="flex items-center gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium transition-colors",
                  locale === lang.code
                    ? "bg-amber-700 text-white"
                    : "hover:bg-amber-800"
                )}
                aria-label={`Switch to ${lang.name}`}
              >
                {lang.flag} {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg  group-hover:scale-105 transition-transform">
              <img src="./logo.png" alt="Dekleineman Logo" />
            </div>
            {/* <span
              className={cn(
                "text-xl font-bold transition-colors",
                isScrolled ? "text-amber-900" : "text-amber-900"
              )}
            >
              dekleineman
            </span> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-medium transition-colors relative py-1",
                  isScrolled
                    ? "text-foreground hover:text-amber-600"
                    : "text-foreground hover:text-amber-600",
                  pathname === link.href &&
                    "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className={cn(
                "font-medium transition-colors relative py-1",
                isScrolled
                  ? "text-foreground hover:text-amber-600"
                  : "text-foreground hover:text-amber-600",
                pathname === "/admin/login" &&
                  "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500"
              )}
            >
              <ShieldPlus />
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Language switcher (mobile) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    isScrolled ? "text-foreground" : "text-foreground"
                  )}
                  aria-label="Change language"
                >
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLocale(lang.code)}
                    className={cn(
                      locale === lang.code && "bg-amber-100 text-amber-900"
                    )}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart button */}
            <Link href="/order">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "relative",
                  isScrolled ? "text-foreground" : "text-foreground"
                )}
                aria-label={`Shopping cart with ${totalItems} items`}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Order button */}
            <Link href="/order" className="hidden sm:block">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg">
                {t.hero.orderOnline}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden",
                isScrolled ? "text-foreground" : "text-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-amber-200/20 pt-4 ">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "py-2 px-4 rounded-lg font-medium transition-colors",
                    pathname === link.href
                      ? "bg-amber-500/20 text-amber-600"
                      : isScrolled
                      ? "text-foreground hover:bg-muted"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2"
              >
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold">
                  {t.hero.orderOnline}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
