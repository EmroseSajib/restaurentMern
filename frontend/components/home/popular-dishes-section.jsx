"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MenuItemCard } from "../menu/menu-item-card";
// import { getPopularItems } from "@/lib/data/menu"

export function PopularDishesSection({ items = [] }) {
  const { t } = useI18n();
  // const popularItems = getPopularItems().slice(0, 6)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-3">
            {t.popularDishes.title}
          </h2>
          <p className="text-lg text-amber-700/80">
            {t.popularDishes.subtitle}
          </p>
        </div>

        {/* Dishes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {items?.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* View full menu CTA */}
        <div className="text-center">
          <Link href="/menu">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white font-semibold bg-transparent"
            >
              {t.hero.viewMenu}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
