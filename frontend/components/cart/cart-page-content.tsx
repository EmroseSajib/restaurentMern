"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CartItem } from "@/components/domain/cart-item"
import { FreeBonusSelector } from "@/components/domain/free-bonus-selector"
import { EmptyState } from "@/components/ui/empty-state"
import { useCart } from "@/hooks/use-cart"
import { Separator } from "@/components/ui/separator"

export function CartPageContent() {
  const t = useTranslations()
  const { items, subtotal, isLoaded, eligibleForFreeBonus, freeBonus, setFreeBonus } = useCart()

  if (!isLoaded) {
    return null
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-16 w-16" />}
        title={t("cart.empty")}
        description={t("cart.emptyDescription")}
        action={
          <Link href="/menu">
            <Button>{t("common.viewMenu")}</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/menu">
          <Button variant="ghost" size="icon" className="bg-transparent">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="font-sans text-3xl font-bold text-foreground">{t("cart.title")}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("cart.itemsInCart", { count: items.reduce((sum, i) => sum + i.quantity, 0) })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.map((item) => (
            <CartItem key={item.menuItem._id} item={item} />
          ))}

          {eligibleForFreeBonus && (
            <>
              <Separator className="my-6" />
              <FreeBonusSelector value={freeBonus} onChange={setFreeBonus} />
            </>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div className="w-full flex items-center justify-between text-lg font-semibold">
            <span>{t("common.subtotal")}</span>
            <span className="text-primary">
              {"€"}
              {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            <Link href="/menu">
              <Button variant="outline" className="w-full bg-transparent">
                {t("cart.continueShopping")}
              </Button>
            </Link>
            <Link href="/checkout">
              <Button className="w-full">{t("common.proceedToCheckout")}</Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
