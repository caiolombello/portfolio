"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Language = "pt" | "en" | "es"

interface LanguageContextType {
  language: Language
  changeLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Traduções padrão
const defaultTranslations = {
  pt: {
    about: "Sobre Mim",
    resume: "Currículo",
    portfolio: "Portfólio",
    blog: "Blog",
    contact: "Contato",
    mainSkills: "Habilidades Principais",
    scheduleAMeeting: "Agende uma Reunião",
    sendMessage: "Enviar Mensagem",
    name: "Nome",
    email: "Email",
    message: "Mensagem",
    send: "Enviar",
    phone: "Telefone",
    birthDate: "Data de Nascimento",
    location: "Localização",
    socialNetworks: "Redes Sociais",
    allRightsReserved: "Todos os direitos reservados.",
    buyMeACoffee: "Me Pague um Café",
    support: "Apoie meu Trabalho",
    supportMessage: "Se meu trabalho foi útil para você, considere me pagar um café!",
    nav: {
      about: "Sobre Mim",
      resume: "Currículo",
      portfolio: "Portfólio",
      blog: "Blog",
      contact: "Contato",
    },
    footer: {
      copyright: "Caio Lombello Vendramini Barbieri. Todos os direitos reservados.",
    },
  },
  en: {
    about: "About Me",
    resume: "Resume",
    portfolio: "Portfolio",
    blog: "Blog",
    contact: "Contact",
    mainSkills: "Main Skills",
    scheduleAMeeting: "Schedule a Meeting",
    sendMessage: "Send Message",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send",
    phone: "Phone",
    birthDate: "Birth Date",
    location: "Location",
    socialNetworks: "Social Networks",
    allRightsReserved: "All rights reserved.",
    buyMeACoffee: "Buy Me a Coffee",
    support: "Support My Work",
    supportMessage: "If my work has been helpful to you, consider buying me a coffee!",
    nav: {
      about: "About Me",
      resume: "Resume",
      portfolio: "Portfolio",
      blog: "Blog",
      contact: "Contact",
    },
    footer: {
      copyright: "Caio Lombello Vendramini Barbieri. All rights reserved.",
    },
  },
  es: {
    about: "Sobre Mí",
    resume: "Currículo",
    portfolio: "Portafolio",
    blog: "Blog",
    contact: "Contacto",
    mainSkills: "Habilidades Principales",
    scheduleAMeeting: "Programar una Reunión",
    sendMessage: "Enviar Mensaje",
    name: "Nombre",
    email: "Correo Electrónico",
    message: "Mensaje",
    send: "Enviar",
    phone: "Teléfono",
    birthDate: "Fecha de Nacimiento",
    location: "Ubicación",
    socialNetworks: "Redes Sociales",
    allRightsReserved: "Todos los derechos reservados.",
    buyMeACoffee: "Cómprame un Café",
    support: "Apoya mi Trabajo",
    supportMessage: "Si mi trabajo te ha sido útil, ¡considere comprarme un café!",
    nav: {
      about: "Sobre Mí",
      resume: "Currículo",
      portfolio: "Portafolio",
      blog: "Blog",
      contact: "Contacto",
    },
    footer: {
      copyright: "Caio Lombello Vendramini Barbieri. Todos los derechos reservados.",
    },
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt")
  const [translations, setTranslations] = useState(defaultTranslations)

  useEffect(() => {
    // Carregar idioma do localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "pt" || savedLanguage === "en" || savedLanguage === "es")) {
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
        const fallbackLang = language === "pt" ? "en" : language === "en" ? "pt" : "es"
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

