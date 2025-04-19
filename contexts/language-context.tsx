"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import pt from "@/translations/pt.json";
import en from "@/translations/en.json";
import es from "@/translations/es.json";
// Se existir, importe o espanhol
// import es from "@/translations/es.json";

type Language = "pt" | "en" | "es"

interface LanguageContextType {
  language: Language
  changeLanguage: (lang: Language) => void
  t: (key: string) => string
}

type TranslationObject = typeof pt
const defaultTranslations: Record<Language, TranslationObject> = { pt, en, es };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt")
  const [translations, setTranslations] = useState(defaultTranslations)

  useEffect(() => {
    // Carregar idioma do localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "pt" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }

    // Atualizar o atributo lang do HTML
    document.documentElement.lang = savedLanguage || "pt"
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    document.documentElement.lang = lang
  }

  // Função para obter traduções, incluindo chaves aninhadas como "nav.about"
  const t = (key: string): string => {
    const keys = key.split(".")
    let result: any = translations[language]

    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k]
      } else {
        console.warn(`Tradução não encontrada para a chave: ${key}`)
        // Tentar encontrar no outro idioma como fallback
        const fallbackLang: Language = language === "pt" ? "en" : "pt"
        let fallback: any = translations[fallbackLang]

        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk]
          } else {
            return key // Se não encontrar em nenhum idioma, retorna a própria chave
          }
        }

        return typeof fallback === "string" ? fallback : key
      }
    }

    return typeof result === "string" ? result : key
  }

  return <LanguageContext.Provider value={{ language, changeLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

