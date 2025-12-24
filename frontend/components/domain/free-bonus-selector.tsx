"use client"

import { useTranslations } from "next-intl"
import { Gift } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { FreeBonus } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

interface FreeBonusSelectorProps {
  value: FreeBonus
  onChange: (value: FreeBonus) => void
  className?: string
}

export function FreeBonusSelector({ value, onChange, className }: FreeBonusSelectorProps) {
  const t = useTranslations("cart")

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 text-primary">
        <Gift className="h-5 w-5" />
        <span className="font-semibold">{t("freeBonusTitle")}</span>
      </div>
      <p className="text-sm text-muted-foreground">{t("freeBonusDescription")}</p>
      <RadioGroup
        value={value || ""}
        onValueChange={(v) => onChange(v as FreeBonus)}
        className="grid grid-cols-2 gap-3"
      >
        <div>
          <RadioGroupItem value="rice" id="rice" className="peer sr-only" />
          <Label
            htmlFor="rice"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all"
          >
            <span className="font-medium">{t("rice")}</span>
            <span className="text-sm text-muted-foreground">{"€"}0.00</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="naan" id="naan" className="peer sr-only" />
          <Label
            htmlFor="naan"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all"
          >
            <span className="font-medium">{t("naan")}</span>
            <span className="text-sm text-muted-foreground">{"€"}0.00</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
