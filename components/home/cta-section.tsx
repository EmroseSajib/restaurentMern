"use client";

import { useI18n } from "@/lib/i18n/context";
import { Calendar, Gift, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  const { t } = useI18n();

  const actions = [
    {
      href: "/reservation",
      icon: Calendar,
      label: t.hero.reserveTable,
      description: {
        en: "Book your table for a special evening",
        nl: "Reserveer uw tafel voor een speciale avond",
        de: "Reservieren Sie Ihren Tisch für einen besonderen Abend",
      },
      gradient: "from-orange-500 to-red-500",
    },
    {
      href: "https://www.restaurantdekleineman.nl/#menu",
      icon: ShoppingCart,
      label: t.hero.orderOnline,
      description: {
        en: "Order your favorite dishes online",
        nl: "Bestel uw favoriete gerechten online",
        de: "Bestellen Sie Ihre Lieblingsgerichte online",
      },
      gradient: "from-amber-500 to-orange-600",
    },

    {
      href: "/catering",
      icon: Gift,
      label: t.hero.catering,
      description: {
        en: "Fresh catering for every special occasion.",
        nl: "Verse catering voor elke speciale gelegenheid.",
        de: "Frisches Catering für jeden besonderen Anlass.",
      },

      gradient: "from-red-500 to-pink-500",
    },
  ];

  const { locale } = useI18n();

  return (
    <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                target={
                  action.href == "https://www.restaurantdekleineman.nl/#menu"
                    ? "_blank"
                    : "_self"
                }
                className="group block"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-300 text-center h-full">
                  <div
                    className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">
                    {action.label}
                  </h3>
                  <p className="text-amber-700/70">
                    {action.description[locale]}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
