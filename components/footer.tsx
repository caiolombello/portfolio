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
        const response = await fetch("/api/public/profile")
        if (response.ok) {
          const data = await response.json()
          if (data) {
            const fullName = data[language]?.name || "Caio Lombello Vendramini Barbieri"
            const nameParts = fullName.split(" ")
            const shortName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}` : fullName
            setProfileName(shortName)
            setSocialLinks({
              github: data.socialLinks?.github || "https://github.com/caiolombello",
              linkedin: data.socialLinks?.linkedin || "https://linkedin.com/in/caiolvbarbieri",
              twitter: data.socialLinks?.twitter || "https://twitter.com/caiolombello",
              instagram: data.socialLinks?.instagram || "https://instagram.com/caiolombello",
              website: data.socialLinks?.website || "https://caio.lombello.com",
              whatsapp: data.socialLinks?.whatsapp || "https://wa.me/5519997536692",
            })
          }
        }
      } catch (error) {
        // fallback para nome e links fixos
        const fullName = "Caio Lombello Vendramini Barbieri"
        const nameParts = fullName.split(" ")
        const shortName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}` : fullName
        setProfileName(shortName)
        setSocialLinks({
          github: "https://github.com/caiolombello",
          linkedin: "https://linkedin.com/in/caiolvbarbieri",
          twitter: "https://twitter.com/caiolombello",
          instagram: "https://instagram.com/caiolombello",
          website: "https://caio.lombello.com",
          whatsapp: "https://wa.me/5519997536692",
        })
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

