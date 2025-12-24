"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { CheckCircle, Phone, MapPin, Clock, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { OrderStatusBadge } from "@/components/admin/order-status-badge"
import { Separator } from "@/components/ui/separator"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"
import { useOrder } from "@/hooks/use-orders"

export function OrderSuccessContent() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("orderNumber")

  const { order, isLoading } = useOrder(orderNumber || "")

  if (isLoading) {
    return <SkeletonLoader variant="text" count={10} />
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Order not found</p>
        <Link href="/">
          <Button className="mt-4">{t("orderSuccess.backToHome")}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 text-center">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>

      {/* Title */}
      <div>
        <h1 className="font-sans text-3xl md:text-4xl font-bold text-foreground">{t("orderSuccess.title")}</h1>
        <p className="mt-2 text-muted-foreground text-lg">{t("orderSuccess.subtitle")}</p>
      </div>

      {/* Order Details Card */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-muted-foreground">{t("orderSuccess.orderNumber")}</p>
              <p className="font-mono text-lg font-semibold">{order.orderNumber}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <Separator />

          {/* Order Items */}
          <div className="text-left space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">
                  {"€"}
                  {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("common.subtotal")}</span>
              <span>
                {"€"}
                {order.subtotal.toFixed(2)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>
                  -{"€"}
                  {order.discount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("common.deliveryFee")}</span>
              <span>{order.deliveryFee === 0 ? t("common.free") : `€${order.deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>{t("common.total")}</span>
              <span className="text-primary">
                {"€"}
                {order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {order.estimatedTime && (
            <>
              <Separator />
              <div className="flex items-center gap-3 text-left">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("orderSuccess.estimatedTime")}</p>
                  <p className="font-medium">{order.estimatedTime}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">{t("orderSuccess.contactUs")}</h3>
          <div className="space-y-3 text-sm text-left">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary" />
              <a href={`tel:${t("contact.phone")}`} className="hover:text-primary transition-colors">
                {t("contact.phone")}
              </a>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-primary mt-0.5" />
              <span>{t("contact.address")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back to Home */}
      <Link href="/">
        <Button size="lg" className="gap-2">
          <Home className="h-5 w-5" />
          {t("orderSuccess.backToHome")}
        </Button>
      </Link>
    </div>
  )
}
