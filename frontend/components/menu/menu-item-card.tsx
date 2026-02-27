"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SpiceIndicator } from "@/components/ui/spice-indicator";
import type { MenuItem } from "@/lib/data/menu";
import { useI18n } from "@/lib/i18n/context";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils/format";
import { Leaf, Plus, Wheat } from "lucide-react";
import Image from "next/image";

interface MenuItemCardProps {
  item: MenuItem;
  variant?: "default" | "compact";
}

export function MenuItemCard({ item, variant = "default" }: MenuItemCardProps) {
  const { locale, t } = useI18n();
  const addItem = useCartStore((state) => state.addItem);

  const name = item.name[locale];
  const description = item.description[locale];

  const handleAddToCart = () => {
    addItem(item);
  };
  console.log("item=====>>", item);

  if (variant === "compact") {
    return (
      <Card className="group hover:shadow-lg transition-shadow">
        <CardContent className="p-4 flex items-center gap-4">
          {item.image && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {description}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-amber-600">
                {formatPrice(item.price)}
              </span>
              {item.spiceLevel && <SpiceIndicator level={item.spiceLevel} />}
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleAddToCart}
            className="shrink-0 h-8 w-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700"
            aria-label={`Add ${name} to cart`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all overflow-hidden">
      {/* Image */}
      {item.image && (
        <div className="relative h-36 overflow-hidden">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badges overlay */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {item.isPopular && (
              <Badge className="bg-amber-500 text-white">Popular</Badge>
            )}
            {item.isNew && (
              <Badge className="bg-green-500 text-white">New</Badge>
            )}
          </div>
          {/* Dietary badges */}
          <div className="absolute top-2 right-2 flex gap-1">
            {item.dietary?.includes("vegetarian") && (
              <div
                className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                title={t.menu.vegetarian}
              >
                <Leaf className="h-3 w-3 text-white" />
              </div>
            )}
            {item.dietary?.includes("glutenFree") && (
              <div
                className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center"
                title={t.menu.glutenFree}
              >
                <Wheat className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </div>
      )}

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg leading-tight">{name}</h3>
          <span className="font-bold text-lg text-amber-600 shrink-0">
            {formatPrice(item.price)}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>

        <div className="flex items-center justify-between">
          {item.spiceLevel && (
            <SpiceIndicator level={item.spiceLevel} showLabel />
          )}
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white ml-auto"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t.popularDishes.orderNow}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
