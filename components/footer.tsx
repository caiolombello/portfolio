"use client";

import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  MessageSquare,
  Rss,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useProfile } from "@/contexts/profile-context";

interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  whatsapp?: string;
}

export default function Footer() {
  const { language } = useLanguage();
  const { config } = useSiteConfig();
  const profile = useProfile();
  const currentYear = new Date().getFullYear();
  const fullName =
    profile?.[language === "en" ? "en" : "pt"]?.name ??
    config.site.shortName;
  const nameParts = fullName.split(" ");
  const profileName =
    nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1]}`
      : fullName;
  const socialLinks: SocialLinks = profile?.socialLinks ?? config.social;

  const rightsText =
    language === "pt"
      ? "Todos os direitos reservados"
      : language === "es"
        ? "Todos los derechos reservados"
        : "All rights reserved";

  return (
    <footer className="border-t border-border/70 py-8 md:py-10" role="contentinfo">
      <div className="container flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex flex-col items-start gap-2">
          <p className="text-left text-sm text-muted-foreground" suppressHydrationWarning>
            &copy; {currentYear} {profileName}
          </p>
          <p className="text-left text-xs text-muted-foreground" suppressHydrationWarning>
            {rightsText}
          </p>
        </div>

        <div
          className="flex flex-wrap items-center gap-1"
          role="navigation"
          aria-label="Social links"
          suppressHydrationWarning
        >
          {socialLinks.github && (
            <Button variant="ghost" size="icon" asChild className="group">
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github size={20} className="transition-colors group-hover:text-gold" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          )}

          {socialLinks.linkedin && (
            <Button variant="ghost" size="icon" asChild className="group">
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="transition-colors group-hover:text-gold" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
          )}

          {socialLinks.twitter && (
            <Button variant="ghost" size="icon" asChild className="group">
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter size={20} className="transition-colors group-hover:text-gold" />
                <span className="sr-only">Twitter</span>
              </a>
            </Button>
          )}

          {socialLinks.instagram && (
            <Button variant="ghost" size="icon" asChild className="group">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={20} className="transition-colors group-hover:text-gold" />
                <span className="sr-only">Instagram</span>
              </a>
            </Button>
          )}

          {socialLinks.website && (
            <Button variant="ghost" size="icon" asChild className="group">
              <a
                href={socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
              >
                <Globe size={20} className="transition-colors group-hover:text-gold" />
                <span className="sr-only">Website</span>
              </a>
            </Button>
          )}

          {socialLinks.whatsapp && (
            <Button variant="ghost" size="icon" asChild className="group">
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <MessageSquare size={20} className="transition-colors group-hover:text-gold" />
                <span className="sr-only">WhatsApp</span>
              </a>
            </Button>
          )}

          <Button variant="ghost" size="icon" asChild className="group">
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RSS Feed"
            >
              <Rss size={20} className="transition-colors group-hover:text-gold" />
              <span className="sr-only">RSS Feed</span>
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
