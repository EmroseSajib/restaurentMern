import { Suspense } from "react"
import { getLocale, getTranslations } from "next-intl/server"
import type { Locale } from "@/i18n/config"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { PageContainer } from "@/components/layout/page-container"
import { Section } from "@/components/layout/section"
import { OrderSuccessContent } from "@/components/order/order-success-content"
import { Toaster } from "@/components/ui/toaster"
import { Spinner } from "@/components/ui/spinner"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("orderSuccess")
  return {
    title: `${t("title")} - dekleineman`,
    description: t("subtitle"),
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function OrderSuccessPage() {
  const locale = (await getLocale()) as Locale

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="pt-20">
        <Section className="pt-12">
          <PageContainer size="narrow">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <Spinner className="h-8 w-8" />
                </div>
              }
            >
              <OrderSuccessContent />
            </Suspense>
          </PageContainer>
        </Section>
      </main>
      <SiteFooter />
      <Toaster />
    </>
  )
}
