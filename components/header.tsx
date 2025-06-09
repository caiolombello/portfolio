"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MobileMenu from "./mobile-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import LanguageSwitcher from "./language-switcher";
import { useLanguage } from "@/contexts/language-context";
import { useSiteConfig } from "@/hooks/use-site-config";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface LocalizedProfile {
  name: string;
  title: string;
  location: string;
  about: string;
}

interface ProfileData {
  pt: LocalizedProfile;
  en: LocalizedProfile;
  email: string;
  phone: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
    whatsapp?: string;
  };
}

export default function Header() {
  const { t, language } = useLanguage();
  const { config, loading: configLoading } = useSiteConfig();
  const pathname = usePathname();
  // Esconder a imagem na navbar quando estiver na home ou na página de contato
  const hideNavbarImage = pathname === "/" || pathname === "/contact";

  const [profile, setProfile] = useState<ProfileData>({
    pt: {
      name: config?.site?.shortName || "Your Name",
      title: config?.site?.title?.split(' - ')[1] || "Engenheiro DevOps",
      location: config?.site?.location || "São Paulo, Brasil",
      about: "",
    },
    en: {
      name: config?.site?.shortName || "Your Name",
      title: config?.site?.title?.split(' - ')[1] || "DevOps Engineer",
      location: config?.site?.location || "São Paulo, Brazil",
      about: "",
    },
    email: config?.site?.email || "",
    phone: config?.site?.phone || "",
    socialLinks: config?.social || {},
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/public/profile");

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
      }
    }

    fetchProfile();
  }, []);

  const navItems = [
    { href: "/", label: t("nav.about") },
    { href: "/resume", label: t("nav.resume") },
    { href: "/portfolio", label: t("nav.projects") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ];

  // Não renderizar até que a configuração seja carregada
  if (configLoading) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {/* Mostrar a imagem na navbar apenas quando NÃO estiver na home ou na página de contato */}
            {!hideNavbarImage && (
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src="/api/profile-image"
                  alt={
                    profile[language as keyof Pick<ProfileData, "pt" | "en">]
                      .name
                  }
                  fill
                  className="object-cover"
                  sizes="32px"
                  priority
                />
              </div>
            )}
            <span className="font-bold">
              {profile[language as keyof Pick<ProfileData, "pt" | "en">].name}
            </span>
            <span className="text-sm text-muted-foreground">
              |{" "}
              {profile[language as keyof Pick<ProfileData, "pt" | "en">].title}
            </span>
          </Link>
          <nav
            className="flex items-center space-x-6 text-sm font-medium"
            role="navigation"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-gold",
                  pathname === item.href
                    ? "text-foreground font-bold"
                    : "text-muted-foreground",
                )}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <MobileMenu
          name={profile[language as keyof Pick<ProfileData, "pt" | "en">].name}
          title={
            profile[language as keyof Pick<ProfileData, "pt" | "en">].title
          }
          imageUrl="/api/profile-image"
          showImage={!hideNavbarImage}
        />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="hidden md:block">
              {/* Espaço para busca ou outros elementos */}
            </div>
          </div>
          <nav
            className="flex items-center gap-2"
            role="navigation"
            aria-label="Utility navigation"
          >
            <LanguageSwitcher />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
