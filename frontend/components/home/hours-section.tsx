"use client";

import { PageContainer } from "@/components/layout/page-container";
import { Section } from "@/components/layout/section";
import { useTranslations } from "next-intl";

export function HoursSection() {
  const t = useTranslations("home");

  return (
    <Section background="muted">
      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* <OpeningHoursCard variant="opening" />
          <OpeningHoursCard variant="delivery" /> */}
        </div>
      </PageContainer>
    </Section>
  );
}
