"use client";

import { PageContainer } from "@/components/layout/page-container";
import { Section } from "@/components/layout/section";
import { useTranslations } from "next-intl";

export function SpecialOffers() {
  const t = useTranslations("home");

  return (
    <Section>
      <PageContainer>
        <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-8">
          {t("specialOffers")}
        </h2>
        {/* <OccasionDiscountSlider /> */}
      </PageContainer>
    </Section>
  );
}
