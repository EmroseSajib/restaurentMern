"use client"

import { useTranslations } from "next-intl"
import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useOpeningHours, useDeliveryHours } from "@/hooks/use-opening-hours"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface OpeningHoursCardProps {
  variant?: "opening" | "delivery"
  className?: string
}

export function OpeningHoursCard({ variant = "opening", className }: OpeningHoursCardProps) {
  const t = useTranslations("home")
  const { openingHours, isLoading: openingLoading } = useOpeningHours()
  const { deliveryHours, isLoading: deliveryLoading } = useDeliveryHours()

  const isLoading = variant === "opening" ? openingLoading : deliveryLoading
  const hours = variant === "opening" ? openingHours : deliveryHours

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" })

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="font-sans text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {variant === "opening" ? t("openingHours") : t("deliveryHours")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        ) : (
          <ul className="space-y-1.5">
            {hours.map((h) => {
              const isClosed = "isClosed" in h ? h.isClosed : !("isAvailable" in h && h.isAvailable)
              const isToday = h.day === today

              return (
                <li
                  key={h.day}
                  className={cn(
                    "flex justify-between text-sm",
                    isToday && "font-semibold text-primary",
                    isClosed && "text-muted-foreground",
                  )}
                >
                  <span>{h.day}</span>
                  <span>{isClosed ? "Closed" : `${h.open} - ${h.close}`}</span>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
