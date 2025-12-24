"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Ticket, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VoucherInputProps {
  onApply: (code: string) => Promise<void>
  isLoading?: boolean
  appliedCode?: string
  error?: string | null
  className?: string
}

export function VoucherInput({ onApply, isLoading, appliedCode, error, className }: VoucherInputProps) {
  const t = useTranslations("checkout")
  const [code, setCode] = useState("")

  const handleApply = async () => {
    if (code.trim()) {
      await onApply(code.trim())
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium flex items-center gap-2">
        <Ticket className="h-4 w-4" />
        {t("voucherCode")}
      </label>
      <div className="flex gap-2">
        <Input
          value={appliedCode || code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          disabled={!!appliedCode || isLoading}
          className={cn(appliedCode && "bg-green-50 border-green-200")}
        />
        {appliedCode ? (
          <Button variant="outline" size="icon" className="shrink-0 text-green-600 bg-transparent">
            <Check className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleApply} disabled={!code.trim() || isLoading} className="shrink-0">
            {t("apply", { ns: "common" })}
          </Button>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <X className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}
