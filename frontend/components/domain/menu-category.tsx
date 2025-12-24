"use client"

import { cn } from "@/lib/utils"

interface MenuCategoryProps {
  name: string
  isActive?: boolean
  onClick?: () => void
  className?: string
}

export function MenuCategory({ name, isActive, onClick, className }: MenuCategoryProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
        "border hover:border-primary hover:text-primary",
        isActive ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border",
        className,
      )}
    >
      {name}
    </button>
  )
}
