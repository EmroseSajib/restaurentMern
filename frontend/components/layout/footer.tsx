"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { restaurantInfo } from "@/lib/data/restaurant";
import { useI18n } from "@/lib/i18n/context";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const { t } = useI18n();

  const formatHours = (hours: [string, string] | null) => {
    if (!hours) return t.hours.closed;
    return `${hours[0]} - ${hours[1]}`;
  };

  const quickLinks = [
    { href: "/menu", label: t.nav.menu },
    { href: "/order", label: t.nav.order },
    { href: "/reservation", label: t.nav.reservation },
    { href: "/gift-voucher", label: t.nav.giftVoucher },
    { href: "/about", label: t.nav.about },
    { href: "/gallery", label: t.nav.gallery },
  ];

  return (
    <footer className="bg-amber-950 text-amber-100">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div>
            <Link href="/" className="flex gap-2 mb-4">
              <div className="w-14 h-14 p-2  rounded-full bg-gradient-to-br from-amber-400 to-orange-600    ">
                {/* <span className="text-5xl font-bold text-white">D</span> */}
                <img src="./logo.png" alt="Dekleineman Logo" />
              </div>
            </Link>
            <p className="text-amber-200/80 text-sm leading-relaxed mb-4">
              {t.about.story.p1.substring(0, 150)}...
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              <a
                href={restaurantInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-amber-900 hover:bg-amber-800 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={restaurantInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-amber-900 hover:bg-amber-800 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-amber-200/80 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t.footer.contactUs}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={restaurantInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-amber-200/80 hover:text-white transition-colors text-sm"
                >
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{restaurantInfo.address.full}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${restaurantInfo.contact.phone}`}
                  className="flex items-center gap-2 text-amber-200/80 hover:text-white transition-colors text-sm"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{restaurantInfo.contact.phoneFormatted}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${restaurantInfo.contact.email}`}
                  className="flex items-center gap-2 text-amber-200/80 hover:text-white transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{restaurantInfo.contact.email}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t.footer.openingHours}
            </h3>
            <ul className="space-y-1 text-sm">
              {[
                {
                  day: t.hours.monday,
                  hours: restaurantInfo.openingHours.monday,
                },
                {
                  day: t.hours.tuesday,
                  hours: restaurantInfo.openingHours.tuesday,
                },
                {
                  day: t.hours.wednesday,
                  hours: restaurantInfo.openingHours.wednesday,
                },
                {
                  day: t.hours.thursday,
                  hours: restaurantInfo.openingHours.thursday,
                },
                {
                  day: t.hours.friday,
                  hours: restaurantInfo.openingHours.friday,
                },
                {
                  day: t.hours.saturday,
                  hours: restaurantInfo.openingHours.saturday,
                },
                {
                  day: t.hours.sunday,
                  hours: restaurantInfo.openingHours.sunday,
                },
              ].map((item) => (
                <li key={item.day} className="flex justify-between">
                  <span className="text-amber-200/80">{item.day}</span>
                  <span
                    className={item.hours ? "text-white" : "text-amber-400"}
                  >
                    {formatHours(item.hours)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-10 pt-8 border-t border-amber-900">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-white font-semibold mb-2">
              {t.footer.newsletter.title}
            </h3>
            <p className="text-amber-200/80 text-sm mb-4">
              {t.footer.newsletter.subtitle}
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder={t.footer.newsletter.placeholder}
                className="bg-amber-900/50 border-amber-800 text-white placeholder:text-amber-400"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shrink-0"
              >
                {t.footer.newsletter.subscribe}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-amber-900/50 py-4">
        <div className="container mx-auto px-4 text-center text-amber-300/60 text-sm">
          {t.footer.copyright}{" "}
          <a
            href="https://taxis.it.com/" // 🔁 your IT website
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-amber-300 hover:text-amber-200 transition-colors"
          >
            Taxis IT
          </a>
        </div>
      </div>
    </footer>
  );
}
