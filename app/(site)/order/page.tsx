import { OrderPageContent } from "@/components/order/order-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Online",
  description:
    "Order authentic Indian food online from dekleineman. Fast delivery in Doetinchem area. Choose from our delicious menu of curries, tandoori, biryanis and more.",
  openGraph: {
    title: "Order Online | dekleineman",
    description: "Order authentic Indian food online for delivery or pickup.",
  },
};

export default function OrderPage() {
  return <OrderPageContent />;
}
