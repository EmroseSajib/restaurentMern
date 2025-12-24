import type React from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  background?: "default" | "muted" | "primary" | "accent"
}

export function Section({ children, className, id, background = "default" }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24",
        {
          "bg-background": background === "default",
          "bg-muted": background === "muted",
          "bg-primary text-primary-foreground": background === "primary",
          "bg-accent text-accent-foreground": background === "accent",
        },
        className,
      )}
    >
      {children}
    </section>
  )
}
