import type React from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  size?: "default" | "narrow" | "wide" | "full"
}

export function PageContainer({ children, className, size = "default" }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        {
          "max-w-4xl": size === "narrow",
          "max-w-6xl": size === "default",
          "max-w-7xl": size === "wide",
          "max-w-none": size === "full",
        },
        className,
      )}
    >
      {children}
    </div>
  )
}
