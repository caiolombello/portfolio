"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getDictionary } from "../app/i18n";
import { locales, type Locale } from "../app/i18n/settings";

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

function detectUserLanguage(): Locale {
  // Check localStorage first
  const savedLanguage = localStorage.getItem("language") as Locale;
  if (savedLanguage && locales.includes(savedLanguage)) {
    return savedLanguage;
  }

  // Then check browser language
  const browserLang = navigator.language.split("-")[0];
  if (locales.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }

  // If no match found, use the first supported locale
  return locales[0];
}

export function LanguageProvider({
  children,
  initialDictionary,
  initialLanguage = "pt"
}: {
  children: ReactNode;
  initialDictionary?: any;
  initialLanguage?: Locale;
}) {
  const [language, setLanguage] = useState<Locale>(initialLanguage);
  const [dictionary, setDictionary] = useState<any>(initialDictionary);
  const [loading, setLoading] = useState(false);
  const [alternateLinks, setAlternateLinks] = useState<Record<string, string>>({});

  // Initialize language after mount, checking localStorage first, then browser language
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Locale;
    if (savedLanguage && locales.includes(savedLanguage)) {
      if (savedLanguage !== language) {
        setLanguage(savedLanguage);
      }
    } else {
      // If no saved language, detect from browser
      const browserLang = navigator.language.split("-")[0];
      if (locales.includes(browserLang as Locale) && browserLang !== language) {
        setLanguage(browserLang as Locale);
      }
    }
    document.documentElement.lang = language;
  }, []);

  // Load dictionary when language changes
  useEffect(() => {
    const load = async () => {
      // Only load if language is different from initial or if we don't have dictionary
      if (language === initialLanguage && dictionary) return;

      setLoading(true);
      try {
        const dict = await getDictionary(language);
        setDictionary(dict);
      } catch (e) {
        console.error("Failed to load dictionary:", e);
        // Keep previous dictionary or null
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [language]);

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
    let result: any = dictionary;
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
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
