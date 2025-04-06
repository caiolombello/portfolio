"use client"

import { useState, useEffect } from "react"
import { Github, Linkedin, Twitter, Instagram, Globe, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
  instagram?: string
  website?: string
  whatsapp?: string
}

interface ProfileData {
  pt: {
    name: string
    [key: string]: any
  }
  en: {
    name: string
    [key: string]: any
  }
  socialLinks: SocialLinks
}

export default function Footer() {
  const { language } = useLanguage()
  const [profileName, setProfileName] = useState("Portfolio")
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({})
  const currentYear = new Date().getFullYear()

  const rightsText =
    language === "pt"
      ? "Todos os direitos reservados"
      : language === "es"
        ? "Todos los derechos reservados"
        : "All rights reserved"

  useEffect(() => {
    async function fetchProfile() {
      try {
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/public/profile?t=${timestamp}`)
        if (response.ok) {
          const data: ProfileData = await response.json()

          // Extrair o nome com base no idioma atual
          const fullName = data[language === "es" ? "en" : language]?.name || "Portfolio"
          const shortName = fullName.split(" ").slice(0, 2).join(" ")
          setProfileName(shortName)

          // Extrair links de redes sociais
          if (data.socialLinks) {
            setSocialLinks(data.socialLinks)
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error)
      }
    }

    fetchProfile()
  }, [language])

  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {currentYear} {profileName}
          </p>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            {rightsText}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {socialLinks.github && (
            <Button variant="ghost" size="icon" asChild>
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github size={20} className="hover:text-gold" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          )}

          {socialLinks.linkedin && (
            <Button variant="ghost" size="icon" asChild>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={20} className="hover:text-gold" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
          )}

          {socialLinks.twitter && (
            <Button variant="ghost" size="icon" asChild>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter size={20} className="hover:text-gold" />
                <span className="sr-only">Twitter</span>
              </a>
            </Button>
          )}

          {socialLinks.instagram && (
            <Button variant="ghost" size="icon" asChild>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} className="hover:text-gold" />
                <span className="sr-only">Instagram</span>
              </a>
            </Button>
          )}

          {socialLinks.website && (
            <Button variant="ghost" size="icon" asChild>
              <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                <Globe size={20} className="hover:text-gold" />
                <span className="sr-only">Website</span>
              </a>
            </Button>
          )}

          {socialLinks.whatsapp && (
            <Button variant="ghost" size="icon" asChild>
              <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <MessageSquare size={20} className="hover:text-gold" />
                <span className="sr-only">WhatsApp</span>
              </a>
            </Button>
          )}
        </div>
      </div>
    </footer>
  )
}

