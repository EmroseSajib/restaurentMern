import { AboutSection } from "@/components/home/about-section";
import { HomeHero } from "@/components/home/home-hero";
import { HoursSection } from "@/components/home/hours-section";
import { SpecialOffers } from "@/components/home/special-offers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/toaster";
import type { Locale } from "@/i18n/config";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations();
  return {
    title: "dekleineman - Authentic Indian Restaurant",
    description: t("home.heroSubtitle"),
    alternates: {
      languages: {
        en: "/",
        nl: "/",
        de: "/",
      },
    },
  };
}

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <HomeHero />
        {/* <FeaturedDishes /> */}
        <SpecialOffers />
        <HoursSection />
        <AboutSection />
      </main>
      <SiteFooter />
      <Toaster />
    </>
  );
}
