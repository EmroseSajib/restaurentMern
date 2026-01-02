import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getRestaurantJsonLd, restaurantInfo } from "@/lib/data/restaurant";
import { I18nProvider } from "@/lib/i18n/context";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import FloatingPortfolioChatbot from "../components/chatBot/PortfolioChatbot";
import "./globals.css";
const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Dekleineman | Authentic Indian Restaurant in Doetinchem",
    template: "%s | dekleineman",
  },
  description:
    "Experience authentic Indian cuisine at dekleineman in Doetinchem, Netherlands. Order online, reserve a table, or visit us for traditional tandoori, curries, and more.",
  keywords: [
    "Indian restaurant",
    "Doetinchem",
    "Indian food",
    "curry",
    "tandoori",
    "delivery",
    "takeaway",
    "Netherlands",
  ],
  authors: [{ name: "dekleineman" }],
  creator: "dekleineman",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    alternateLocale: ["en_GB", "de_DE"],
    url: restaurantInfo.contact.website,
    siteName: "dekleineman",
    title: "Dekleineman | Authentic Indian Restaurant",
    description:
      "Authentic Indian taste in the heart of Doetinchem. Order online or reserve your table today.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "dekleineman Indian Restaurant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "dekleineman | Authentic Indian Restaurant",
    description: "Authentic Indian taste in the heart of Doetinchem.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f59e0b" },
    { media: "(prefers-color-scheme: dark)", color: "#78350f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getRestaurantJsonLd()),
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <I18nProvider>
          <Header />
          <main className="flex-1">
            {children}
            <FloatingPortfolioChatbot />
          </main>
          <Footer />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
