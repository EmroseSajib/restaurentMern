"use client"

import { Leaf, Wheat, Flame, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DietaryBadgesProps {
  isVegetarian?: boolean
  isVegan?: boolean
  isGlutenFree?: boolean
  isSpicy?: boolean
  containsNuts?: boolean
  size?: "sm" | "default"
  className?: string
}

export function DietaryBadges({
  isVegetarian,
  isVegan,
  isGlutenFree,
  isSpicy,
  containsNuts,
  size = "default",
  className,
}: DietaryBadgesProps) {
  const badges = [
    { show: isVegan, label: "Vegan", icon: Leaf, color: "bg-green-100 text-green-700 border-green-200" },
    {
      show: isVegetarian && !isVegan,
      label: "Vegetarian",
      icon: Leaf,
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    {
      show: isGlutenFree,
      label: "Gluten Free",
      icon: Wheat,
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    { show: isSpicy, label: "Spicy", icon: Flame, color: "bg-red-100 text-red-700 border-red-200" },
    {
      show: containsNuts,
      label: "Nuts",
      icon: AlertTriangle,
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
  ].filter((b) => b.show)

  if (badges.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {badges.map((badge) => (
        <Badge
          key={badge.label}
          variant="outline"
          className={cn("gap-1 border", badge.color, size === "sm" && "text-xs px-1.5 py-0")}
        >
          <badge.icon className={cn("shrink-0", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
          <span>{badge.label}</span>
        </Badge>
      ))}
    </div>
  )
}
