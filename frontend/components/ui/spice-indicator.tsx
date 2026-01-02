import { Flame } from "lucide-react"
import type { SpiceLevel } from "@/lib/data/menu"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

interface SpiceIndicatorProps {
  level: SpiceLevel
  showLabel?: boolean
  size?: "sm" | "md"
}

const spiceLevels: Record<SpiceLevel, number> = {
  mild: 1,
  medium: 2,
  hot: 3,
  veryHot: 4,
}

export function SpiceIndicator({ level, showLabel = false, size = "sm" }: SpiceIndicatorProps) {
  const { t } = useI18n()
  const count = spiceLevels[level]
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4"

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <Flame key={i} className={cn(iconSize, i < count ? "text-orange-500" : "text-gray-300")} />
        ))}
      </div>
      {showLabel && <span className="text-xs text-muted-foreground ml-1">{t.menu.spiceLevel[level]}</span>}
    </div>
  )
}
