"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Gift, Ticket, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { createVoucher, validateVoucher } from "@/lib/api"
import { cn } from "@/lib/utils"

const VOUCHER_AMOUNTS = [25, 50, 75, 100]

export function VoucherPageContent() {
  const t = useTranslations("voucher")
  const { toast } = useToast()

  // Purchase state
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(50)
  const [customAmount, setCustomAmount] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [personalMessage, setPersonalMessage] = useState("")
  const [isPurchasing, setIsPurchasing] = useState(false)

  // Redeem state
  const [redeemCode, setRedeemCode] = useState("")
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [voucherBalance, setVoucherBalance] = useState<number | null>(null)

  const finalAmount = selectedAmount === "custom" ? Number(customAmount) || 0 : selectedAmount

  const handlePurchase = async () => {
    if (!recipientEmail || finalAmount < 10) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid email and amount (minimum €10)",
        variant: "destructive",
      })
      return
    }

    setIsPurchasing(true)
    try {
      await createVoucher({
        amount: finalAmount,
        recipientEmail,
        personalMessage: personalMessage || undefined,
      })
      toast({
        title: "Voucher purchased!",
        description: `A €${finalAmount} gift voucher has been sent to ${recipientEmail}`,
      })
      setRecipientEmail("")
      setPersonalMessage("")
      setSelectedAmount(50)
    } catch {
      toast({
        title: "Purchase failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleRedeem = async () => {
    if (!redeemCode.trim()) return

    setIsRedeeming(true)
    try {
      const response = await validateVoucher(redeemCode)
      if (response.data.valid && response.data.voucher) {
        setVoucherBalance(response.data.voucher.balance)
        toast({
          title: "Voucher valid!",
          description: `Balance: €${response.data.voucher.balance.toFixed(2)}`,
        })
      } else {
        toast({
          title: "Invalid voucher",
          description: response.data.message || "This voucher code is not valid",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Validation failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsRedeeming(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <Gift className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-sans text-4xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground text-lg">{t("subtitle")}</p>
      </div>

      {/* Purchase Voucher */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            {t("purchaseTitle")}
          </CardTitle>
          <CardDescription>Send a gift voucher to someone special</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Selection */}
          <div className="space-y-3">
            <Label>{t("selectAmount")}</Label>
            <RadioGroup
              value={String(selectedAmount)}
              onValueChange={(v) => setSelectedAmount(v === "custom" ? "custom" : Number(v))}
              className="grid grid-cols-2 sm:grid-cols-5 gap-3"
            >
              {VOUCHER_AMOUNTS.map((amount) => (
                <div key={amount}>
                  <RadioGroupItem value={String(amount)} id={`amount-${amount}`} className="peer sr-only" />
                  <Label
                    htmlFor={`amount-${amount}`}
                    className={cn(
                      "flex items-center justify-center rounded-lg border-2 p-3 cursor-pointer transition-all",
                      "hover:bg-accent peer-data-[state=checked]:border-primary",
                    )}
                  >
                    {"€"}
                    {amount}
                  </Label>
                </div>
              ))}
              <div>
                <RadioGroupItem value="custom" id="amount-custom" className="peer sr-only" />
                <Label
                  htmlFor="amount-custom"
                  className={cn(
                    "flex items-center justify-center rounded-lg border-2 p-3 cursor-pointer transition-all",
                    "hover:bg-accent peer-data-[state=checked]:border-primary",
                  )}
                >
                  {t("customAmount")}
                </Label>
              </div>
            </RadioGroup>

            {selectedAmount === "custom" && (
              <Input
                type="number"
                min={10}
                placeholder="Enter amount (min €10)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* Recipient Email */}
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">{t("recipientEmail")}</Label>
            <Input
              id="recipientEmail"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="recipient@email.com"
            />
          </div>

          {/* Personal Message */}
          <div className="space-y-2">
            <Label htmlFor="personalMessage">{t("personalMessage")}</Label>
            <Textarea
              id="personalMessage"
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              placeholder="Add a personal message (optional)"
              rows={3}
            />
          </div>

          {/* Purchase Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handlePurchase}
            disabled={isPurchasing || finalAmount < 10 || !recipientEmail}
          >
            {isPurchasing ? "Processing..." : `${t("buyNow")} - €${finalAmount}`}
          </Button>
        </CardContent>
      </Card>

      {/* Redeem Voucher */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            {t("redeemTitle")}
          </CardTitle>
          <CardDescription>Check your voucher balance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="redeemCode">{t("enterCode")}</Label>
            <div className="flex gap-2">
              <Input
                id="redeemCode"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                placeholder="Enter voucher code"
              />
              <Button onClick={handleRedeem} disabled={isRedeeming || !redeemCode.trim()}>
                {t("redeem")}
              </Button>
            </div>
          </div>

          {voucherBalance !== null && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 text-green-700">
              <Check className="h-5 w-5" />
              <span>
                Voucher balance:{" "}
                <strong>
                  {"€"}
                  {voucherBalance.toFixed(2)}
                </strong>
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
