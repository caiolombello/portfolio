"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import MobileMenu from "./mobile-menu"
import { ModeToggle } from "@/components/ui/mode-toggle"
import LanguageSwitcher from "./language-switcher"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"
import { usePathname } from "next/navigation"

interface ProfileData {
  name: string
  title: string
  imageUrl?: string
}

export default function Header() {
  const { t, language } = useLanguage()
  const pathname = usePathname() // Obter a rota atual
  const isHomePage = pathname === "/" // Verificar se está na página inicial

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
            // Extrair apenas o nome principal e o cargo principal para o header
            const fullName = data[language]?.name || "Caio Barbieri"
            const shortName = fullName.split(" ").slice(0, 2).join(" ") // Pega os dois primeiros nomes

            // Extrair apenas o cargo principal (antes do primeiro |)
            const fullTitle = data[language]?.title || "Engenheiro DevOps"
            const mainTitle = fullTitle.split("|")[0].trim()

            setProfile({
              name: shortName,
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {/* Mostrar a imagem apenas se NÃO estiver na página inicial */}
            {!isHomePage && (
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image src={profile.imageUrl || "/placeholder.svg"} alt={profile.name} fill className="object-cover" />
              </div>
            )}
            <span className="font-bold">{profile.name}</span>
            <span className="text-sm text-muted-foreground">| {profile.title}</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-gold text-foreground">
              {t("about")}
            </Link>
            <Link href="/resume" className="transition-colors hover:text-gold text-muted-foreground">
              {t("resume")}
            </Link>
            <Link href="/portfolio" className="transition-colors hover:text-gold text-muted-foreground">
              {t("portfolio")}
            </Link>
            <Link href="/blog" className="transition-colors hover:text-gold text-muted-foreground">
              {t("blog")}
            </Link>
            <Link href="/contact" className="transition-colors hover:text-gold text-muted-foreground">
              {t("contact")}
            </Link>
          </nav>
        </div>
        <MobileMenu
          name={profile.name}
          title={profile.title}
          imageUrl={profile.imageUrl}
          showImage={!isHomePage} // Passar a informação para o MobileMenu
        />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="hidden md:block">{/* Espaço para busca ou outros elementos */}</div>
          </div>
          <nav className="flex items-center gap-2">
            <LanguageSwitcher />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

