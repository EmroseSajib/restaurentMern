"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { ArrowLeft, CreditCard, Banknote, Truck, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { OrderSummary } from "@/components/domain/order-summary"
import { VoucherInput } from "@/components/domain/voucher-input"
import { MembershipInput } from "@/components/domain/membership-input"
import { EmptyState } from "@/components/ui/empty-state"
import { useCheckout } from "@/hooks/use-checkout"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

export function CheckoutPageContent() {
  const t = useTranslations()
  const router = useRouter()
  const { items, isLoaded } = useCart()
  const {
    state,
    updateField,
    updateCustomer,
    applyVoucher,
    applyMembership,
    placeOrder,
    isLoading,
    error,
    deliveryFee,
  } = useCheckout()

  const [voucherError, setVoucherError] = useState<string | null>(null)
  const [membershipError, setMembershipError] = useState<string | null>(null)

  const handlePlaceOrder = async () => {
    try {
      const order = await placeOrder()
      router.push(`/order-success?orderNumber=${order.orderNumber}`)
    } catch {
      // Error handled in hook
    }
  }

  const handleApplyVoucher = async (code: string) => {
    setVoucherError(null)
    try {
      await applyVoucher(code)
    } catch (err) {
      setVoucherError(err instanceof Error ? err.message : "Invalid voucher")
    }
  }

  const handleApplyMembership = async (memberId: string) => {
    setMembershipError(null)
    try {
      await applyMembership(memberId)
    } catch (err) {
      setMembershipError(err instanceof Error ? err.message : "Invalid membership")
    }
  }

  if (!isLoaded) return null

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add items to your cart before checkout"
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
        <Link href="/cart">
          <Button variant="ghost" size="icon" className="bg-transparent">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="font-sans text-3xl font-bold text-foreground">{t("checkout.title")}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("common.delivery")} / {t("common.pickup")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={state.deliveryType}
                onValueChange={(v) => updateField("deliveryType", v as "delivery" | "pickup")}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
                  <Label
                    htmlFor="delivery"
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all",
                      "hover:bg-accent peer-data-[state=checked]:border-primary",
                    )}
                  >
                    <Truck className="h-6 w-6 mb-2" />
                    <span className="font-medium">{t("common.delivery")}</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                  <Label
                    htmlFor="pickup"
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all",
                      "hover:bg-accent peer-data-[state=checked]:border-primary",
                    )}
                  >
                    <Store className="h-6 w-6 mb-2" />
                    <span className="font-medium">{t("common.pickup")}</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("checkout.contactInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("checkout.name")}</Label>
                  <Input
                    id="name"
                    value={state.customer.name}
                    onChange={(e) => updateCustomer("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("checkout.phone")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={state.customer.phone}
                    onChange={(e) => updateCustomer("phone", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("checkout.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={state.customer.email}
                  onChange={(e) => updateCustomer("email", e.target.value)}
                  required
                />
              </div>

              {state.deliveryType === "delivery" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="address">{t("checkout.address")}</Label>
                    <Input
                      id="address"
                      value={state.customer.address}
                      onChange={(e) => updateCustomer("address", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t("checkout.city")}</Label>
                      <Input
                        id="city"
                        value={state.customer.city}
                        onChange={(e) => updateCustomer("city", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">{t("checkout.postalCode")}</Label>
                      <Input
                        id="postalCode"
                        value={state.customer.postalCode}
                        onChange={(e) => updateCustomer("postalCode", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">{t("checkout.notes")}</Label>
                <Textarea
                  id="notes"
                  value={state.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder={t("checkout.notesPlaceholder")}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("checkout.paymentMethod")}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={state.paymentMethod}
                onValueChange={(v) => updateField("paymentMethod", v as "stripe" | "cod")}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="stripe" id="stripe" className="peer sr-only" />
                  <Label
                    htmlFor="stripe"
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all",
                      "hover:bg-accent peer-data-[state=checked]:border-primary",
                    )}
                  >
                    <CreditCard className="h-6 w-6 mb-2" />
                    <span className="font-medium">{t("checkout.stripe")}</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                  <Label
                    htmlFor="cod"
                    className={cn(
                      "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all",
                      "hover:bg-accent peer-data-[state=checked]:border-primary",
                    )}
                  >
                    <Banknote className="h-6 w-6 mb-2" />
                    <span className="font-medium">{t("checkout.cod")}</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Voucher & Membership */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Discounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <VoucherInput
                onApply={handleApplyVoucher}
                isLoading={isLoading}
                appliedCode={state.voucherCode}
                error={voucherError}
              />
              <MembershipInput
                onApply={handleApplyMembership}
                isLoading={isLoading}
                appliedId={state.membershipId}
                error={membershipError}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="pt-6">
              <OrderSummary
                deliveryFee={deliveryFee}
                voucherDiscount={state.voucherDiscount}
                membershipDiscount={state.membershipDiscount}
              />

              {error && <p className="text-sm text-destructive mt-4">{error}</p>}

              <Button className="w-full mt-6" size="lg" onClick={handlePlaceOrder} disabled={isLoading}>
                {isLoading ? t("checkout.processing") : t("checkout.placeOrder")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
