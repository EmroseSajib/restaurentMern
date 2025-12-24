import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import type React from "react";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "dekleineman - Authentic Indian Restaurant",
  description:
    "Experience authentic Indian cuisine at dekleineman in Doetinchem, Netherlands. Order online, make reservations, or inquire about catering.",
  generator: "v0.app",
  keywords: [
    "Indian restaurant",
    "Doetinchem",
    "Indian food",
    "curry",
    "tandoori",
    "dekleineman",
  ],
  authors: [{ name: "dekleineman" }],
  openGraph: {
    title: "dekleineman - Authentic Indian Restaurant",
    description:
      "Experience authentic Indian cuisine at dekleineman in Doetinchem, Netherlands.",
    type: "website",
    locale: "en_NL",
    siteName: "dekleineman",
  },
  twitter: {
    card: "summary_large_image",
    title: "dekleineman - Authentic Indian Restaurant",
    description:
      "Experience authentic Indian cuisine at dekleineman in Doetinchem, Netherlands.",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased`}
        cz-shortcut-listen="true"
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>

        <Analytics />
      </body>
    </html>
  );
}
