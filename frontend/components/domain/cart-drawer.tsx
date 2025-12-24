"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { CartItem } from "./cart-item"
import { FreeBonusSelector } from "./free-bonus-selector"
import { EmptyState } from "@/components/ui/empty-state"
import { useCart } from "@/hooks/use-cart"

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const t = useTranslations()
  const { items, subtotal, eligibleForFreeBonus, freeBonus, setFreeBonus } = useCart()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-sans">{t("cart.title")}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={<ShoppingBag className="h-12 w-12" />}
              title={t("cart.empty")}
              description={t("cart.emptyDescription")}
              action={
                <Link href="/menu">
                  <Button onClick={() => onOpenChange(false)}>{t("common.viewMenu")}</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              {items.map((item) => (
                <CartItem key={item.menuItem._id} item={item} />
              ))}

              {eligibleForFreeBonus && (
                <div className="mt-6 pt-4 border-t">
                  <FreeBonusSelector value={freeBonus} onChange={setFreeBonus} />
                </div>
              )}
            </div>

            <SheetFooter className="border-t pt-4">
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>{t("common.subtotal")}</span>
                  <span>
                    {"€"}
                    {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    {t("cart.continueShopping")}
                  </Button>
                  <Link href="/checkout">
                    <Button className="w-full" onClick={() => onOpenChange(false)}>
                      {t("common.checkout")}
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
