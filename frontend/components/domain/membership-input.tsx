"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { CreditCard, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MembershipInputProps {
  onApply: (memberId: string) => Promise<void>
  isLoading?: boolean
  appliedId?: string
  discountPercentage?: number
  error?: string | null
  className?: string
}

export function MembershipInput({
  onApply,
  isLoading,
  appliedId,
  discountPercentage,
  error,
  className,
}: MembershipInputProps) {
  const t = useTranslations("checkout")
  const [memberId, setMemberId] = useState("")

  const handleApply = async () => {
    if (memberId.trim()) {
      await onApply(memberId.trim())
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium flex items-center gap-2">
        <CreditCard className="h-4 w-4" />
        {t("membershipId")}
      </label>
      <div className="flex gap-2">
        <Input
          value={appliedId || memberId}
          onChange={(e) => setMemberId(e.target.value)}
          placeholder="Enter membership ID"
          disabled={!!appliedId || isLoading}
          className={cn(appliedId && "bg-green-50 border-green-200")}
        />
        {appliedId ? (
          <Button variant="outline" size="icon" className="shrink-0 text-green-600 bg-transparent">
            <Check className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleApply} disabled={!memberId.trim() || isLoading} className="shrink-0">
            {t("apply", { ns: "common" })}
          </Button>
        )}
      </div>
      {appliedId && discountPercentage && (
        <p className="text-sm text-green-600">{discountPercentage}% membership discount applied!</p>
      )}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <X className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}
