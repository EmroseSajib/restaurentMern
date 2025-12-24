import { getRequestConfig } from "next-intl/server"
import { cookies, headers } from "next/headers"
import { locales, defaultLocale, type Locale } from "./config"

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const headersList = await headers()

  let locale: Locale = defaultLocale

  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined
  if (cookieLocale && locales.includes(cookieLocale)) {
    locale = cookieLocale
  } else {
    const acceptLanguage = headersList.get("accept-language")
    if (acceptLanguage) {
      const browserLocale = acceptLanguage.split(",")[0].split("-")[0] as Locale
      if (locales.includes(browserLocale)) {
        locale = browserLocale
      }
    }
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
