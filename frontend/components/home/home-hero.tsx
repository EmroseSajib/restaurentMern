"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"

export function HomeHero() {
  const t = useTranslations("home")
  const tCommon = useTranslations("common")

  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/elegant-indian-restaurant-interior-warm-lighting.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      <PageContainer className="relative z-10">
        <div className="max-w-2xl">
          <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">{t("heroSubtitle")}</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/menu">
              <Button size="lg" className="gap-2 text-base">
                {tCommon("orderNow")}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/reservations">
              <Button size="lg" variant="outline" className="text-base bg-transparent">
                {tCommon("bookTable")}
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
