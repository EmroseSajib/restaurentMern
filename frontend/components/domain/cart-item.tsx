"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart, type CartItem as CartItemType } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

interface CartItemProps {
  item: CartItemType
  className?: string
}

export function CartItem({ item, className }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className={cn("flex gap-4 py-4 border-b last:border-0", className)}>
      {item.menuItem.image && (
        <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden">
          <Image
            src={item.menuItem.image || "/placeholder.svg"}
            alt={item.menuItem.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-foreground truncate">{item.menuItem.name}</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
            onClick={() => removeItem(item.menuItem._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {item.notes && <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-transparent"
              onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-transparent"
              onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="font-semibold text-primary">
            {"€"}
            {(item.menuItem.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
