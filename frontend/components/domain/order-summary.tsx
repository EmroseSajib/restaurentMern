"use client"

import { useTranslations } from "next-intl"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

interface OrderSummaryProps {
  deliveryFee: number
  voucherDiscount?: number
  membershipDiscount?: number
  className?: string
}

export function OrderSummary({
  deliveryFee,
  voucherDiscount = 0,
  membershipDiscount = 0,
  className,
}: OrderSummaryProps) {
  const t = useTranslations()
  const { items, subtotal, freeBonus } = useCart()

  const total = subtotal - voucherDiscount - membershipDiscount + deliveryFee

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-sans text-lg font-semibold">{t("checkout.orderSummary")}</h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.menuItem._id} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {item.quantity}x {item.menuItem.name}
            </span>
            <span>
              {"€"}
              {(item.menuItem.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        {freeBonus && (
          <div className="flex justify-between text-sm text-primary">
            <span>1x {freeBonus === "rice" ? t("cart.rice") : t("cart.naan")} (Free Bonus)</span>
            <span>{"€"}0.00</span>
          </div>
        )}
      </div>

      <div className="border-t pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("common.subtotal")}</span>
          <span>
            {"€"}
            {subtotal.toFixed(2)}
          </span>
        </div>

        {voucherDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Voucher Discount</span>
            <span>
              -{"€"}
              {voucherDiscount.toFixed(2)}
            </span>
          </div>
        )}

        {membershipDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Membership Discount</span>
            <span>
              -{"€"}
              {membershipDiscount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("common.deliveryFee")}</span>
          <span>{deliveryFee === 0 ? t("common.free") : `€${deliveryFee.toFixed(2)}`}</span>
        </div>

        <div className="flex justify-between text-lg font-semibold pt-2 border-t">
          <span>{t("common.total")}</span>
          <span className="text-primary">
            {"€"}
            {total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
