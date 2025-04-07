"use client"

import Image from "next/image"
import Link from "next/link"
import { EnvelopeIcon, PhoneIcon, CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline"
import ContactForm from "./contact-form"
import { useLanguage } from "@/contexts/language-context"
import { useEffect, useState } from "react"

interface ProfileData {
  name: string
  title: string
  imageUrl?: string
}

export default function Contact() {
  const { t, language } = useLanguage()
  const [profile, setProfile] = useState<ProfileData>({
    name: "Caio Barbieri",
    title: language === "pt" ? "Engenheiro DevOps Pleno" : "Senior DevOps Engineer",
    imageUrl: "/images/profile-ios.png",
  })

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/public/profile")

        if (response.ok) {
          const data = await response.json()
          if (data) {
            const fullName = data[language]?.name || "Caio Barbieri"
            const fullTitle = data[language]?.title || "Engenheiro DevOps"
            const mainTitle = fullTitle.split("|")[0].trim()

            setProfile({
              name: fullName,
              title: mainTitle,
              imageUrl: data.imageUrl || "/images/profile-ios.png",
            })
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error)
      }
    }

    fetchProfile()
  }, [language])

  return (
    <div className="container py-12">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="relative mb-6 h-32 w-32 overflow-hidden rounded-full">
          <Image
            src={profile.imageUrl || "/placeholder.svg"}
            alt={profile.name}
            fill
            className="object-cover"
          />
        </div>
        <h1 className="mb-2 text-4xl font-bold text-gold">{profile.name}</h1>
        <p className="text-xl text-muted-foreground">{profile.title}</p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Coluna Esquerda - Informações de Contato */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-gold shadow-sm transition-transform duration-200 hover:scale-110">
                <EnvelopeIcon className="h-5 w-5" />
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
                <PhoneIcon className="h-5 w-5" />
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
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("birthDate")}</p>
                <p className="text-foreground">{language === "pt" ? "16 de dezembro de 2002" : "December 16, 2002"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-gold shadow-sm transition-transform duration-200 hover:scale-110">
                <MapPinIcon className="h-5 w-5" />
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

