"use client";

import Image from "next/image";
import Link from "next/link";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import ContactForm from "./contact-form";
import { useLanguage } from "@/contexts/language-context";
import { useEffect, useState } from "react";

interface ProfileData {
  name: string;
  title: string;
  imageUrl?: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
  email?: string;
  phone?: string;
  location?: string;
}

export default function Contact() {
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<ProfileData>({
    name: "Caio Lombello Vendramini Barbieri",
    title: language === "pt" ? "Engenheiro DevOps" : "DevOps Engineer",
    imageUrl: "/images/profile-ios.png",
    socialLinks: {
      github: "https://github.com/caiolombello",
      linkedin: "https://linkedin.com/in/caiolvbarbieri",
      twitter: "https://twitter.com/caiolombello",
      website: "https://caio.lombello.com",
    },
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/public/profile");

        if (response.ok) {
          const data = await response.json();
          if (data) {
            const fullName =
              data[language]?.name || "Caio Lombello Vendramini Barbieri";
            const fullTitle = data[language]?.title || "Engenheiro DevOps";
            const mainTitle = fullTitle.split("|")[0].trim();

            setProfile({
              name: fullName,
              title: mainTitle,
              imageUrl: data.imageUrl || "/images/profile-ios.png",
              socialLinks: {
                github:
                  data.socialLinks?.github || "https://github.com/caiolombello",
                linkedin:
                  data.socialLinks?.linkedin ||
                  "https://linkedin.com/in/caiolvbarbieri",
                twitter:
                  data.socialLinks?.twitter ||
                  "https://twitter.com/caiolombello",
                website:
                  data.socialLinks?.website || "https://caio.lombello.com",
              },
              email: data.email || "caio@lombello.com",
              phone: data.phone || "+55 (19) 99753-6692",
              location:
                data.location ||
                (language === "pt"
                  ? "Campinas, São Paulo, Brasil"
                  : "Campinas, São Paulo, Brazil"),
            });
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
      }
    }

    fetchProfile();
  }, [language]);

  return (
    <div className="container py-12">
      {/* Header Section */}
      <div className="mb-16 flex flex-col items-center text-center">
        <div className="relative mb-8 h-40 w-40 overflow-hidden rounded-full ring-4 ring-gold/20">
          <Image
            src={profile.imageUrl || "/placeholder.svg"}
            alt={profile.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <h1 className="mb-3 text-4xl font-bold text-gold">{profile.name}</h1>
        <p className="text-xl text-muted-foreground">{profile.title}</p>
      </div>

      <div className="mx-auto max-w-5xl grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Contact Information */}
        <div className="space-y-8 rounded-lg border border-border/40 bg-card p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gold mb-8">
            {t("contact.info")}
          </h2>

          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-gold shadow-sm transition-transform duration-200 hover:scale-110">
                <EnvelopeIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("contact.email")}
                </p>
                <Link
                  href={`mailto:${profile.email || "caio@lombello.com"}`}
                  className="text-foreground hover:text-gold transition-colors duration-200"
                >
                  {profile.email || "caio@lombello.com"}
                </Link>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-gold shadow-sm transition-transform duration-200 hover:scale-110">
                <PhoneIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("contact.phone")}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`tel:${profile.phone || "+5519997536692"}`}
                    className="text-foreground hover:text-gold transition-colors duration-200"
                  >
                    {profile.phone || "+55 (19) 99753-6692"}
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

            {/* Location */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-gold shadow-sm transition-transform duration-200 hover:scale-110">
                <MapPinIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("contact.location")}
                </p>
                <p className="text-foreground">
                  {profile.location ||
                    (language === "pt"
                      ? "Campinas, São Paulo, Brasil"
                      : "Campinas, São Paulo, Brazil")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-lg border border-border/40 bg-card p-8 shadow-md">
          <h2 className="mb-8 text-2xl font-bold text-gold">
            {t("contact.send")}
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
