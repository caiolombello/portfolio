"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

interface MobileMenuProps {
  name: string
  title: string
  imageUrl?: string
  showImage?: boolean // Nova prop para controlar a exibição da imagem
}

export default function MobileMenu({
  name,
  title,
  imageUrl = "/images/profile-ios.png",
  showImage = true, // Por padrão, mostrar a imagem
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    // Impedir rolagem quando o menu está aberto
    if (!isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }

  return (
    <>
      <div className="flex md:hidden">
        <Link href="/" className="flex items-center space-x-2">
          {/* Mostrar a imagem apenas se showImage for true */}
          {showImage && (
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
            </div>
          )}
          <span className="font-bold">{name}</span>
        </Link>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleMenu}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay do menu mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
          <div className="fixed inset-x-0 top-0 z-50 min-h-screen w-full border-b bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2" onClick={toggleMenu}>
                {/* Mostrar a imagem apenas se showImage for true */}
                {showImage && (
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <div className="font-bold">{name}</div>
                  <div className="text-sm text-muted-foreground">{title}</div>
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Fechar menu">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="mt-8 flex flex-col space-y-6">
              <Link href="/" className="text-lg font-medium transition-colors hover:text-gold" onClick={toggleMenu}>
                {t("about")}
              </Link>
              <Link
                href="/resume"
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-gold"
                onClick={toggleMenu}
              >
                {t("resume")}
              </Link>
              <Link
                href="/portfolio"
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-gold"
                onClick={toggleMenu}
              >
                {t("portfolio")}
              </Link>
              <Link
                href="/blog"
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-gold"
                onClick={toggleMenu}
              >
                {t("blog")}
              </Link>
              <Link
                href="/contact"
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-gold"
                onClick={toggleMenu}
              >
                {t("contact")}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

