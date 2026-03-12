import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { I18nProvider } from "@/lib/i18n/context";
import { Analytics } from "@vercel/analytics/next";
import FloatingPortfolioChatbot from "../../components/chatBot/PortfolioChatbot";
export default function SiteLayout({ children }) {
  return (
    <>
      <main>
        <I18nProvider>
          <Header />
          <main className="flex-1">
            {children}
            <FloatingPortfolioChatbot />
          </main>
          <Footer />
        </I18nProvider>
        <Analytics />
      </main>
    </>
  );
}
