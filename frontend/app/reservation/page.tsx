import type { Metadata } from "next"
import { ReservationPageContent } from "@/components/reservation/reservation-page-content"

export const metadata: Metadata = {
  title: "Reserve a Table",
  description:
    "Book your table at dekleineman Indian restaurant in Doetinchem. Easy online reservation for an unforgettable dining experience.",
  openGraph: {
    title: "Reserve a Table | dekleineman",
    description: "Book your table for an authentic Indian dining experience.",
  },
}

export default function ReservationPage() {
  return <ReservationPageContent />
}
