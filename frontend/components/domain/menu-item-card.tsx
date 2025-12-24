"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Plus, Minus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DietaryBadges } from "./dietary-badges"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import type { MenuItem } from "@/lib/api"
import { cn } from "@/lib/utils"

interface MenuItemCardProps {
  item: MenuItem
  variant?: "default" | "compact"
  className?: string
}

export function MenuItemCard({ item, variant = "default", className }: MenuItemCardProps) {
  const t = useTranslations()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    addItem(item, quantity)
    toast({
      title: t("menu.addedToCart"),
      description: `${quantity}x ${item.name}`,
    })
    setQuantity(1)
  }

  if (variant === "compact") {
    return (
      <Card className={cn("overflow-hidden hover:shadow-md transition-shadow", className)}>
        <CardContent className="p-4 flex gap-4">
          {item.image && (
            <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-sans font-semibold text-foreground truncate">{item.name}</h3>
              <span className="font-semibold text-primary shrink-0">
                {"€"}
                {item.price.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
            <div className="flex items-center justify-between mt-2">
              <DietaryBadges
                isVegetarian={item.isVegetarian}
                isVegan={item.isVegan}
                isGlutenFree={item.isGlutenFree}
                isSpicy={item.isSpicy}
                containsNuts={item.containsNuts}
                size="sm"
              />
              <Button size="sm" onClick={handleAddToCart} disabled={!item.isAvailable} className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "overflow-hidden group hover:shadow-lg transition-all duration-300",
        !item.isAvailable && "opacity-60",
        className,
      )}
    >
      {item.image && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-muted-foreground font-medium">Currently Unavailable</span>
            </div>
          )}
        </div>
      )}
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-sans text-lg font-semibold text-foreground">{item.name}</h3>
          <span className="font-bold text-lg text-primary">
            {"€"}
            {item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
        <DietaryBadges
          isVegetarian={item.isVegetarian}
          isVegan={item.isVegan}
          isGlutenFree={item.isGlutenFree}
          isSpicy={item.isSpicy}
          containsNuts={item.containsNuts}
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
          <Button onClick={handleAddToCart} disabled={!item.isAvailable}>
            {t("common.addToCart")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
