"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getDictionary } from "@/app/i18n";
import { locales, type Locale } from "@/app/i18n/settings";

// Tipos
export type Language = "pt" | "en" | "es";

interface LanguageContextType {
  language: Locale;
  changeLanguage: (lang: Locale) => void;
  t: (key: string) => string;
  loading: boolean;
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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Locale>(locales[0]); // Temporary initial value
  const [dictionary, setDictionary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Initialize language on mount
  useEffect(() => {
    const userLang = detectUserLanguage();
    setLanguage(userLang);
    document.documentElement.lang = userLang;
  }, []);

  // Load dictionary when language changes
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const dict = await getDictionary(language);
        setDictionary(dict);
      } catch (e) {
        console.error("Failed to load dictionary:", e);
        setDictionary(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [language]);

  const changeLanguage = (lang: Locale) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
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
    <LanguageContext.Provider value={{ language, changeLanguage, t, loading }}>
      {loading ? (
        <div
          style={{
            minHeight: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="animate-spin h-8 w-8 border-4 border-gold rounded-full"
            style={{ borderTopColor: "transparent" }}
          />
        </div>
      ) : (
        children
      )}
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
