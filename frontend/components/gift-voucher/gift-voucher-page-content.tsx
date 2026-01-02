"use client"

import type React from "react"

import { useState } from "react"
import { Gift, CheckCircle, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/context"
import { formatPrice, generateVoucherCode } from "@/lib/utils/format"
import { cn } from "@/lib/utils"

const voucherAmounts = [25, 50, 75, 100]

interface FormData {
  amount: number
  customAmount: string
  recipientName: string
  recipientEmail: string
  message: string
  buyerName: string
  buyerEmail: string
}

export function GiftVoucherPageContent() {
  const { locale, t } = useI18n()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    amount: 50,
    customAmount: "",
    recipientName: "",
    recipientEmail: "",
    message: "",
    buyerName: "",
    buyerEmail: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [useCustomAmount, setUseCustomAmount] = useState(false)

  const selectedAmount = useCustomAmount ? Number(formData.customAmount) || 0 : formData.amount

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (useCustomAmount && (!formData.customAmount || Number(formData.customAmount) < 10)) {
      newErrors.customAmount = locale === "nl" ? "Min. €10" : locale === "de" ? "Min. €10" : "Min. €10"
    }
    if (!formData.recipientName.trim()) newErrors.recipientName = t.common.required
    if (!formData.recipientEmail.trim()) newErrors.recipientEmail = t.common.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipientEmail)) {
      newErrors.recipientEmail = "Invalid email"
    }
    if (!formData.buyerName.trim()) newErrors.buyerName = t.common.required
    if (!formData.buyerEmail.trim()) newErrors.buyerEmail = t.common.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.buyerEmail)) {
      newErrors.buyerEmail = "Invalid email"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Generate voucher code
      const code = generateVoucherCode()

      // Send to API
      await fetch("/api/gift-vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: selectedAmount,
          voucherCode: code,
        }),
      })

      setGeneratedCode(code)
      setIsSuccess(true)
    } catch (error) {
      console.error("Voucher error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-24 lg:pt-32 flex items-center">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t.giftVoucher.success.title}</h1>
              <p className="text-muted-foreground mb-6">{t.giftVoucher.success.message}</p>

              {/* Voucher code display */}
              <div className="bg-amber-50 rounded-lg p-6 mb-6">
                <p className="text-sm text-amber-700 mb-2">{t.giftVoucher.success.voucherCode}</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-mono font-bold text-amber-900">{generatedCode}</span>
                  <Button variant="ghost" size="icon" onClick={handleCopyCode} className="h-8 w-8">
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-lg font-semibold text-amber-600 mt-2">{formatPrice(selectedAmount)}</p>
              </div>

              <p className="text-sm text-muted-foreground">{t.giftVoucher.success.instructions}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 lg:pt-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Gift className="h-16 w-16 mx-auto mb-4 text-amber-300" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.giftVoucher.title}</h1>
          <p className="text-xl text-amber-100/80">{t.giftVoucher.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Amount selection */}
                <div>
                  <Label className="text-lg font-semibold text-amber-900">{t.giftVoucher.selectAmount}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {voucherAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, amount }))
                          setUseCustomAmount(false)
                        }}
                        className={cn(
                          "p-4 rounded-lg border-2 font-bold text-lg transition-all",
                          !useCustomAmount && formData.amount === amount
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-gray-200 hover:border-amber-300",
                        )}
                      >
                        {formatPrice(amount)}
                      </button>
                    ))}
                  </div>

                  {/* Custom amount */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setUseCustomAmount(true)}
                      className={cn("text-sm text-amber-600 hover:text-amber-700", useCustomAmount && "font-semibold")}
                    >
                      {t.giftVoucher.customAmount}
                    </button>
                    {useCustomAmount && (
                      <div className="mt-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                          <Input
                            type="number"
                            min="10"
                            step="1"
                            value={formData.customAmount}
                            onChange={(e) => handleInputChange("customAmount", e.target.value)}
                            className={cn("pl-8", errors.customAmount && "border-red-500")}
                            placeholder="10"
                          />
                        </div>
                        {errors.customAmount && <p className="text-xs text-red-500 mt-1">{errors.customAmount}</p>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recipient info */}
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 mb-4">{t.giftVoucher.recipientInfo.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recipientName">{t.giftVoucher.recipientInfo.name} *</Label>
                      <Input
                        id="recipientName"
                        value={formData.recipientName}
                        onChange={(e) => handleInputChange("recipientName", e.target.value)}
                        className={cn(errors.recipientName && "border-red-500")}
                      />
                      {errors.recipientName && <p className="text-xs text-red-500 mt-1">{errors.recipientName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="recipientEmail">{t.giftVoucher.recipientInfo.email} *</Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        value={formData.recipientEmail}
                        onChange={(e) => handleInputChange("recipientEmail", e.target.value)}
                        className={cn(errors.recipientEmail && "border-red-500")}
                      />
                      {errors.recipientEmail && <p className="text-xs text-red-500 mt-1">{errors.recipientEmail}</p>}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="message">{t.giftVoucher.recipientInfo.message}</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={3}
                      placeholder={
                        locale === "nl"
                          ? "Voeg een persoonlijk bericht toe..."
                          : locale === "de"
                            ? "Fügen Sie eine persönliche Nachricht hinzu..."
                            : "Add a personal message..."
                      }
                    />
                  </div>
                </div>

                {/* Buyer info */}
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 mb-4">{t.giftVoucher.buyerInfo.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="buyerName">{t.giftVoucher.buyerInfo.name} *</Label>
                      <Input
                        id="buyerName"
                        value={formData.buyerName}
                        onChange={(e) => handleInputChange("buyerName", e.target.value)}
                        className={cn(errors.buyerName && "border-red-500")}
                      />
                      {errors.buyerName && <p className="text-xs text-red-500 mt-1">{errors.buyerName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="buyerEmail">{t.giftVoucher.buyerInfo.email} *</Label>
                      <Input
                        id="buyerEmail"
                        type="email"
                        value={formData.buyerEmail}
                        onChange={(e) => handleInputChange("buyerEmail", e.target.value)}
                        className={cn(errors.buyerEmail && "border-red-500")}
                      />
                      {errors.buyerEmail && <p className="text-xs text-red-500 mt-1">{errors.buyerEmail}</p>}
                    </div>
                  </div>
                </div>

                {/* Summary and submit */}
                <div className="bg-amber-50 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-amber-900">
                      {locale === "nl" ? "Bedrag" : locale === "de" ? "Betrag" : "Amount"}
                    </span>
                    <span className="text-2xl font-bold text-amber-600">{formatPrice(selectedAmount)}</span>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || selectedAmount < 10}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6"
                  >
                    {isSubmitting ? t.common.loading : t.giftVoucher.purchase}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
