"use client"

import { Utensils, Leaf, Sparkles, Heart } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

const highlightIcons = {
  authentic: Utensils,
  fresh: Leaf,
  spices: Sparkles,
  service: Heart,
}

export function HighlightsSection() {
  const { t } = useI18n()

  const highlights = [
    { key: "authentic", icon: highlightIcons.authentic, ...t.highlights.authentic },
    { key: "fresh", icon: highlightIcons.fresh, ...t.highlights.fresh },
    { key: "spices", icon: highlightIcons.spices, ...t.highlights.spices },
    { key: "service", icon: highlightIcons.service, ...t.highlights.service },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-3">{t.highlights.title}</h2>
          <p className="text-lg text-amber-700/80">{t.highlights.subtitle}</p>
        </div>

        {/* Highlight cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon
            return (
              <div
                key={highlight.key}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-300"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                {/* Content */}
                <h3 className="text-xl font-bold text-amber-900 mb-2">{highlight.title}</h3>
                <p className="text-amber-700/70 leading-relaxed">{highlight.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
