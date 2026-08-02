"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getDictionary } from "../app/i18n";
import type { Locale } from "../app/i18n/settings";

type TranslationDictionary = Awaited<ReturnType<typeof getDictionary>>;

// Tipos
export type Language = "pt" | "en" | "es";

interface LanguageContextType {
  language: Locale;
  changeLanguage: (lang: Locale) => void;
  t: (key: string) => string;
  loading: boolean;
  alternateLinks?: Record<string, string>;
  setAlternateLinks?: (links: Record<string, string>) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({
  children,
  initialDictionary,
  initialLanguage = "pt"
}: {
  children: ReactNode;
  initialDictionary?: TranslationDictionary;
  initialLanguage?: Locale;
}) {
  const [language, setLanguage] = useState<Locale>(initialLanguage);
  const [dictionary, setDictionary] = useState<
    TranslationDictionary | undefined
  >(initialDictionary);
  const [loadedLanguage, setLoadedLanguage] = useState<Locale | undefined>(
    initialDictionary ? initialLanguage : undefined,
  );
  const [loading, setLoading] = useState(false);
  const [alternateLinks, setAlternateLinks] = useState<Record<string, string>>({});

  // The URL-selected locale is authoritative for indexable pages.
  useEffect(() => {
    document.documentElement.lang = initialLanguage;
  }, [initialLanguage]);

  // Load dictionary when language changes
  useEffect(() => {
    let active = true;

    const load = async () => {
      if (loadedLanguage === language && dictionary) return;

      setLoading(true);
      try {
        const dict = await getDictionary(language);
        if (active) {
          setDictionary(dict);
          setLoadedLanguage(language);
        }
      } catch (e) {
        console.error("Failed to load dictionary:", e);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();

    return () => {
      active = false;
    };
  }, [dictionary, language, loadedLanguage]);

  const changeLanguage = (lang: Locale) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = lang;
  };

  // Function to get translations, including nested keys like "nav.about"
  const t = (key: string): string => {
    if (!dictionary) return key;
    const keys = key.split(".");
    let result: unknown = dictionary;
    for (const k of keys) {
      if (typeof result === "object" && result !== null && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    return typeof result === "string" ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, loading, alternateLinks, setAlternateLinks }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
