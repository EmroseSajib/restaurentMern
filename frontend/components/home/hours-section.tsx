"use client"

import { Clock, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"
import { restaurantInfo } from "@/lib/data/restaurant"
import { cn } from "@/lib/utils"

export function HoursSection() {
  const { t } = useI18n()

  const formatHours = (hours: [string, string] | null) => {
    if (!hours) return t.hours.closed
    return `${hours[0]} - ${hours[1]}`
  }

  const days = [
    { key: "monday" as const, label: t.hours.monday },
    { key: "tuesday" as const, label: t.hours.tuesday },
    { key: "wednesday" as const, label: t.hours.wednesday },
    { key: "thursday" as const, label: t.hours.thursday },
    { key: "friday" as const, label: t.hours.friday },
    { key: "saturday" as const, label: t.hours.saturday },
    { key: "sunday" as const, label: t.hours.sunday },
  ]

  // Get current day
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as keyof typeof restaurantInfo.openingHours

  return (
    <section className="py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Opening Hours */}
          <Card className="shadow-lg border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t.hours.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-amber-100">
                {days.map((day) => {
                  const hours = restaurantInfo.openingHours[day.key]
                  const isToday = day.key === today
                  return (
                    <li
                      key={day.key}
                      className={cn("flex justify-between py-3 px-4", isToday && "bg-amber-100/50 font-medium")}
                    >
                      <span className="text-amber-900">
                        {day.label}
                        {isToday && <span className="ml-2 text-xs text-amber-600 font-normal">(Today)</span>}
                      </span>
                      <span className={cn(hours ? "text-amber-700" : "text-red-500")}>{formatHours(hours)}</span>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Delivery Hours */}
          <Card className="shadow-lg border-amber-200">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {t.hours.deliveryTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-amber-100">
                {days.map((day) => {
                  const hours = restaurantInfo.deliveryHours[day.key]
                  const isToday = day.key === today
                  return (
                    <li
                      key={day.key}
                      className={cn("flex justify-between py-3 px-4", isToday && "bg-amber-100/50 font-medium")}
                    >
                      <span className="text-amber-900">{day.label}</span>
                      <span className={cn(hours ? "text-amber-700" : "text-red-500")}>{formatHours(hours)}</span>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
