"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { DietaryBadges } from "./dietary-badges";

// ✅ Use your new API type (adjust import to where you store it)
type LocalizedText = { en: string; nl: string; de: string };
type Money = { amount: number; currency: string };

export type MenuItem = {
  id: string;
  categoryId: string;
  name: LocalizedText;
  description: LocalizedText;
  price: Money;

  available: boolean;
  isMainDish: boolean;

  spicy: boolean;
  nuts: boolean;
  glutenFree: boolean;
  vegetarian: boolean;
  vegan: boolean;

  imageUrl?: string;
};

interface MenuItemCardProps {
  item: MenuItem;
  variant?: "default" | "compact";
  className?: string;
}

export function MenuItemCard({
  item,
  variant = "default",
  className,
}: MenuItemCardProps) {
  const t = useTranslations();
  const locale = useLocale() as "en" | "nl" | "de";

  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const name = item?.name?.[locale] ?? item?.name?.en ?? "";
  const description =
    item?.description?.[locale] ?? item?.description?.en ?? "";

  const handleAddToCart = () => {
    // If your cart expects the old shape, you may need to adapt there too.
    addItem(item as any, quantity);
    toast({
      title: t("menu.addedToCart"),
      description: `${quantity}x ${name}`,
    });
    setQuantity(1);
  };

  const image = item.imageUrl;

  if (variant === "compact") {
    return (
      <Card
        className={cn(
          "overflow-hidden hover:shadow-md transition-shadow",
          className
        )}
      >
        <CardContent className="p-4 flex gap-4">
          {image && (
            <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden">
              <Image
                src={image || "/placeholder.svg"}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-sans font-semibold text-foreground truncate">
                {name}
              </h3>
              <span className="font-semibold text-primary shrink-0">
                {item?.price ?? "0.00"}
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>

            <div className="flex items-center justify-between mt-2">
              <DietaryBadges
                isVegetarian={item.vegetarian}
                isVegan={item.vegan}
                isGlutenFree={item.glutenFree}
                isSpicy={item.spicy}
                containsNuts={item.nuts}
                size="sm"
              />
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={!item.available}
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "overflow-hidden group hover:shadow-lg transition-all duration-300",
        !item.available && "opacity-60",
        className
      )}
    >
      {image && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!item.available && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-muted-foreground font-medium">
                Currently Unavailable
              </span>
            </div>
          )}
        </div>
      )}

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-sans text-lg font-semibold text-foreground">
            {name}
          </h3>
          <span className="font-bold text-lg text-primary">
            {item?.price ?? "0.00"}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>

        <DietaryBadges
          isVegetarian={item.vegetarian}
          isVegan={item.vegan}
          isGlutenFree={item.glutenFree}
          isSpicy={item.spicy}
          containsNuts={item.nuts}
          className="mb-4"
        />

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={handleAddToCart} disabled={!item.available}>
            {t("common.addToCart")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
