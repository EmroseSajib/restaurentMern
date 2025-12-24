"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"
import { Section } from "@/components/layout/section"
import { MenuItemCard } from "@/components/domain/menu-item-card"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"
import { useMenu } from "@/hooks/use-menu"

export function FeaturedDishes() {
  const t = useTranslations("home")
  const tCommon = useTranslations("common")
  const { menu, isLoading } = useMenu()

  // Get first 3 main dishes
  const featuredDishes = menu.filter((item) => item.isMainDish && item.isAvailable).slice(0, 3)

  return (
    <Section background="muted">
      <PageContainer>
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground">{t("featuredDishes")}</h2>
            <p className="mt-2 text-muted-foreground">Discover our chef&apos;s signature creations</p>
          </div>
          <Link href="/menu" className="hidden sm:flex">
            <Button variant="ghost" className="gap-2 bg-transparent">
              {tCommon("seeAll")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <SkeletonLoader variant="card" count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDishes.map((dish) => (
              <MenuItemCard key={dish._id} item={dish} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/menu">
            <Button variant="outline" className="gap-2 bg-transparent">
              {tCommon("seeAll")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </PageContainer>
    </Section>
  )
}
