"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { type Locale, translations, getTranslations } from "./translations"

type TranslationType = typeof translations.en

interface I18nContextType {
  locale: Locale
  t: TranslationType
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const LOCALE_STORAGE_KEY = "dekleineman-locale"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("nl") // Default to Dutch for Netherlands
  const [t, setT] = useState<TranslationType>(translations.nl)

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
    if (savedLocale && translations[savedLocale]) {
      setLocaleState(savedLocale)
      setT(getTranslations(savedLocale))
    } else {
      // Detect browser language
      const browserLang = navigator.language.split("-")[0]
      if (browserLang === "nl" || browserLang === "de" || browserLang === "en") {
        setLocaleState(browserLang as Locale)
        setT(getTranslations(browserLang as Locale))
      }
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    setT(getTranslations(newLocale))
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
    // Update html lang attribute
    document.documentElement.lang = newLocale
  }, [])

  return <I18nContext.Provider value={{ locale, t, setLocale }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
