import { getLocale, getTranslations } from "next-intl/server"
import type { Locale } from "@/i18n/config"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { PageContainer } from "@/components/layout/page-container"
import { Section } from "@/components/layout/section"
import { VoucherPageContent } from "@/components/voucher/voucher-page-content"
import { Toaster } from "@/components/ui/toaster"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("voucher")
  return {
    title: `${t("title")} - dekleineman`,
    description: t("subtitle"),
    openGraph: {
      title: `${t("title")} - dekleineman`,
      description: t("subtitle"),
      type: "website",
    },
  }
}

export default async function GiftVouchersPage() {
  const locale = (await getLocale()) as Locale

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="pt-20">
        <Section className="pt-12">
          <PageContainer size="narrow">
            <VoucherPageContent />
          </PageContainer>
        </Section>
      </main>
      <SiteFooter />
      <Toaster />
    </>
  )
}
