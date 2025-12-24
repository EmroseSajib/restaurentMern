"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { PageContainer } from "./page-container"

export function SiteFooter() {
  const t = useTranslations()
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: "/menu", label: t("nav.menu") },
    { href: "/reservations", label: t("nav.reservations") },
    { href: "/catering", label: t("nav.catering") },
    { href: "/gift-vouchers", label: t("nav.giftVouchers") },
  ]

  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <PageContainer size="wide" className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="font-sans text-2xl font-bold">
              dekleineman
            </Link>
            <p className="text-sidebar-foreground/80 text-sm leading-relaxed">{t("footer.tagline")}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-sans text-lg font-semibold">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-sans text-lg font-semibold">{t("nav.contact")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-sidebar-foreground/80">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                <span>{t("contact.address")}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-sidebar-foreground/80">
                <Phone className="h-4 w-4 shrink-0" />
                <a href={`tel:${t("contact.phone")}`} className="hover:text-sidebar-foreground">
                  {t("contact.phone")}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-sidebar-foreground/80">
                <Mail className="h-4 w-4 shrink-0" />
                <a href={`mailto:${t("contact.email")}`} className="hover:text-sidebar-foreground">
                  {t("contact.email")}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h3 className="font-sans text-lg font-semibold">{t("footer.hours")}</h3>
            <ul className="space-y-2 text-sm text-sidebar-foreground/80">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Mon - Thu: 16:00 - 22:00</span>
              </li>
              <li className="pl-6">Fri - Sat: 16:00 - 23:00</li>
              <li className="pl-6">Sun: 15:00 - 22:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-sidebar-border text-center text-sm text-sidebar-foreground/60">
          {t("footer.copyright", { year: currentYear })}
        </div>
      </PageContainer>
    </footer>
  )
}
