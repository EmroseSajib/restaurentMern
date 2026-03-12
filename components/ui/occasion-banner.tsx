"use client";

import { useI18n } from "@/lib/i18n/context";
import { X } from "lucide-react";
import { useState } from "react";

interface OccasionBannerProps {
  // Make this configurable - set to false to hide the banner
  isActive?: boolean;
  // Which occasion to show: 'default' | 'christmas' | 'valentine'
  occasion?: "default" | "christmas" | "valentine";
  // Custom message override
  customMessage?: string;
}

export function OccasionBanner({
  isActive = true,
  occasion = "default",
  customMessage,
}: OccasionBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useI18n();

  // Don't render if not active or dismissed
  if (!isActive || !isVisible) return null;

  const message = customMessage || t.banner[occasion];

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white py-2 px-4 relative overflow-hidden">
      {/* Animated background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-spin" />

      <div className="container mx-auto flex items-center justify-center gap-4 relative">
        {/* Banner text with subtle animation */}
        <p className="text-[18px] font-medium text-center animate-pulse-subtle slide-in-left marquee-left-right tracking-widest">
          {message}
        </p>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
