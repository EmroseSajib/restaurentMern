import type { Metadata } from "next"
import { GiftVoucherPageContent } from "@/components/gift-voucher/gift-voucher-page-content"

export const metadata: Metadata = {
  title: "Gift Voucher",
  description:
    "Give the gift of authentic Indian cuisine. Purchase a gift voucher for dekleineman restaurant - the perfect present for food lovers.",
  openGraph: {
    title: "Gift Voucher | dekleineman",
    description: "Give the gift of authentic Indian cuisine with a dekleineman voucher.",
  },
}

export default function GiftVoucherPage() {
  return <GiftVoucherPageContent />
}
