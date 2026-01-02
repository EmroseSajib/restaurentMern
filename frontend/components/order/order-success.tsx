"use client"

import Link from "next/link"
import { CheckCircle, Clock, Home, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"

interface OrderSuccessProps {
  orderNumber: string
}

export function OrderSuccess({ orderNumber }: OrderSuccessProps) {
  const { locale, t } = useI18n()

  // Estimated delivery/pickup time (30-45 minutes)
  const estimatedTime = new Date()
  estimatedTime.setMinutes(estimatedTime.getMinutes() + 35)
  const formattedTime = estimatedTime.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-24 lg:pt-32 flex items-center">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-lg mx-auto shadow-xl">
          <CardContent className="p-8 text-center">
            {/* Success icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t.order.success.title}</h1>
            <p className="text-muted-foreground mb-6">{t.order.success.message}</p>

            {/* Order details */}
            <div className="bg-amber-50 rounded-lg p-4 mb-6 space-y-3">
              <div className="flex items-center justify-center gap-2 text-amber-800">
                <FileText className="h-5 w-5" />
                <span className="font-medium">{t.order.success.orderNumber}:</span>
                <span className="font-bold text-lg">{orderNumber}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-amber-800">
                <Clock className="h-5 w-5" />
                <span className="font-medium">{t.order.success.estimatedTime}:</span>
                <span className="font-bold">~{formattedTime}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link href="/" className="block">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold">
                  <Home className="h-4 w-4 mr-2" />
                  {t.order.success.backHome}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
