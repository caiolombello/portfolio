"use client"

import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, Calendar, MapPin } from "lucide-react"
import ContactForm from "./contact-form"
import { useLanguage } from "@/contexts/language-context"

export default function Contact() {
  const { t, language } = useLanguage()

  return (
    <div className="container py-12">
      <h1 className="mb-12 text-center text-4xl font-bold text-gold">{t("contact")}</h1>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Coluna Esquerda - Informações de Contato */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h2 className="mb-2 text-2xl font-bold text-gold">{t("name")}</h2>
          <p className="mb-6 text-xl text-muted-foreground">
            {language === "pt" ? "DevOps Engineer Pleno" : "Senior DevOps Engineer"}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-gold shadow-sm transition-transform duration-200 hover:scale-110">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <Link
                  href="mailto:caio@lombello.com"
                  className="text-foreground hover:text-gold transition-colors duration-200"
                >
                  caio@lombello.com
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-gold shadow-sm transition-transform duration-200 hover:scale-110">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("phone")}</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="tel:+5519997536692"
                    className="text-foreground hover:text-gold transition-colors duration-200"
                  >
                    +55 (19) 99753-6692
                  </Link>
                  <Link
                    href="https://wa.me/5519997536692"
                    className="text-foreground hover:text-gold transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-gold shadow-sm transition-transform duration-200 hover:scale-110">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("birthDate")}</p>
                <p className="text-foreground">{language === "pt" ? "16 de dezembro de 2002" : "December 16, 2002"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-gold shadow-sm transition-transform duration-200 hover:scale-110">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("location")}</p>
                <p className="text-foreground">
                  {language === "pt" ? "Campinas, São Paulo, Brasil" : "Campinas, São Paulo, Brazil"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Formulário de Contato */}
        <div className="rounded-lg border border-border/40 bg-card p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-bold text-gold">{t("sendMessage")}</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

