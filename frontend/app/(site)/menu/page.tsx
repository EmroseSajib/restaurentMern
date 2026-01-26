import type { Metadata } from "next"
import { MenuPageContent } from "@/componentscomponents/menu/menu-page-content"

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore our authentic Indian menu featuring traditional curries, tandoori dishes, biryanis, and more. Fresh ingredients, premium spices, vegetarian options available.",
  openGraph: {
    title: "Menu | dekleineman",
    description: "Explore our authentic Indian menu featuring traditional curries, tandoori dishes, and more.",
  },
}

export default function MenuPage() {
  return <MenuPageContent />
}
