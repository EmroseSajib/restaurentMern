"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"
import { Section } from "@/components/layout/section"

export function AboutSection() {
  const t = useTranslations("home")
  const tContact = useTranslations("contact")

  return (
    <Section>
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 lg:h-[500px] rounded-lg overflow-hidden">
            <Image src="/indian-chef-cooking-in-restaurant-kitchen.jpg" alt="Our Kitchen" fill className="object-cover" />
          </div>
          <div>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground">{t("ourStory")}</h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">{t("ourStoryText")}</p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                <span className="text-foreground">{tContact("address")}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href={`tel:${tContact("phone")}`} className="text-foreground hover:text-primary transition-colors">
                  {tContact("phone")}
                </a>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/reservations">
                <Button size="lg">{t("findUs")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </Section>
  )
}
