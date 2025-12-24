import { getLocale, getTranslations } from "next-intl/server"
import type { Locale } from "@/i18n/config"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { PageContainer } from "@/components/layout/page-container"
import { Section } from "@/components/layout/section"
import { CartPageContent } from "@/components/cart/cart-page-content"
import { Toaster } from "@/components/ui/toaster"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cart")
  return {
    title: `${t("title")} - dekleineman`,
    description: "Review your order",
  }
}

export default async function CartPage() {
  const locale = (await getLocale()) as Locale

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="pt-20">
        <Section className="pt-12">
          <PageContainer size="narrow">
            <CartPageContent />
          </PageContainer>
        </Section>
      </main>
      <SiteFooter />
      <Toaster />
    </>
  )
}
