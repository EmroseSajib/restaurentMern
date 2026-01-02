"use client";

import { Button } from "@/components/ui/button";
import { restaurantInfo } from "@/lib/data/restaurant";
import { useI18n } from "@/lib/i18n/context";
import { ChevronDown, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('./hero-background.webp')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/40 to-black/40 " />

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-amber-400 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-orange-500 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white py-20">
        {/* Logo/Brand */}
        <div className="mb-6 animate-fade-in">
          <div className="w-24 h-24 p-2 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-2xl mb-4">
            {/* <span className="text-5xl font-bold text-white">D</span> */}
            <img src="./logo.png" alt="Dekleineman Logo" />
          </div>
        </div>

        {/* Restaurant name */}
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-800 bg-clip-text text-transparent uppercase tracking-widest">
            Dekleine man
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-orange-400 font-semibold mb-8 max-w-3xl mx-auto leading-relaxed tracking-widest">
          {t.hero.tagline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/order">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-lg px-8 py-6 shadow-2xl hover:shadow-amber-500/30 transition-all"
            >
              {t.hero.orderOnline}
            </Button>
          </Link>
          <Link href="/menu">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-amber-300/50 text-white hover:bg-amber-500/20 font-semibold text-lg px-8 py-6 backdrop-blur-sm bg-transparent"
            >
              {t.hero.viewMenu}
            </Button>
          </Link>
          <Link href="/reservation">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-amber-300/50 text-white hover:bg-amber-500/20 font-semibold text-lg px-8 py-6 backdrop-blur-sm bg-transparent"
            >
              {t.hero.reserveTable}
            </Button>
          </Link>
        </div>

        {/* Contact info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href={restaurantInfo.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-amber-200 transition-colors"
          >
            <MapPin className="h-5 w-5" />
            <span>{restaurantInfo.address.full}</span>
          </a>
          <span className="hidden sm:block text-amber-400/50">|</span>
          <a
            href={`tel:${restaurantInfo.contact.phone}`}
            className="flex items-center gap-2 hover:text-amber-200 transition-colors"
          >
            <Phone className="h-5 w-5" />
            <span>{restaurantInfo.contact.phoneFormatted}</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
        <ChevronDown className="h-8 w-8" />
      </div>
    </section>
  );
}
