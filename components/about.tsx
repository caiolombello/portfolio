"use client";

import Image from "next/image";
import Link from "next/link";
import {
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import SkillsList from "./skill-bar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { AboutSkeleton } from "@/components/loading-skeleton";

interface ProfileLanguage {
  name: string;
  title: string;
  about: string;
}

interface Profile {
  [key: string]: ProfileLanguage | string;
  imageUrl: string;
  email: string;
  phone: string;
}

interface Skill {
  name: string;
  percentage: number;
}

async function fetchProfile() {
  const res = await fetch("/api/public/profile");
  if (!res.ok) return null;
  return res.json();
}

async function fetchSkills() {
  const res = await fetch("/api/skills");
  if (!res.ok) return [];
  return res.json();
}

export default function About() {
  const { language, t } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [profileData, skillsData] = await Promise.all([
          fetchProfile(),
          fetchSkills()
        ]);
        setProfile(profileData);
        setSkills(skillsData || []);
      } catch (error) {
        console.error('Error loading profile/skills:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [language]);

  if (loading) return <AboutSkeleton />;
  if (!profile) return null;

  const currentProfile = (profile[language] || profile["pt"]) as ProfileLanguage;
  const profileImageUrl = "/api/profile-image";
  const currentSkills =
    Array.isArray(skills) && skills.length > 0
      ? skills
      : [
          { name: "Python & Golang", percentage: 90 },
          { name: "Kubernetes", percentage: 85 },
          { name: "CI/CD Automation", percentage: 90 },
        ];

  return (
    <section className="container py-12 md:py-16">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Coluna Esquerda - Informações Pessoais */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="relative mb-6 h-48 w-48 sm:h-64 sm:w-64 overflow-hidden rounded-full border-4 border-gold shadow-lg shadow-gold/10 transition-transform duration-500 hover:scale-105">
            <Image
              src={profileImageUrl || "/placeholder.svg"}
              alt={currentProfile.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
              priority
            />
          </div>

          <h1 className="mb-2 text-3xl font-bold text-gold md:text-4xl">
            {currentProfile.name}
          </h1>

          <h2 className="mb-6 text-xl text-muted-foreground">
            {currentProfile.title}
          </h2>

          <div className="mb-8 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-4 w-4 text-gold" />
              <Link
                href={`mailto:${profile.email}`}
                className="text-foreground hover:text-gold transition-colors"
              >
                {profile.email}
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-gold" />
              <Link
                href={`tel:${profile.phone}`}
                className="text-foreground hover:text-gold transition-colors"
              >
                {profile.phone}
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button asChild className="gap-2">
              <Link
                href="https://wa.me/5519997536692"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                WhatsApp
              </Link>
            </Button>

            <Button asChild>
              <Link
                href="https://fantastical.app/caiolvbarbieri"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                Agendar reunião
              </Link>
            </Button>
          </div>
        </div>

        {/* Coluna Direita - Sobre e Habilidades */}
        <div className="flex flex-col">
          <h2 className="mb-4 text-2xl font-bold text-gold">
            {t("about.title") || "Sobre"}
          </h2>

          <p className="mb-8 text-muted-foreground">{currentProfile.about}</p>

          <h2 className="mb-6 text-2xl font-bold text-gold">
            {t("about.skills") || "Principais Habilidades"}
          </h2>

          <SkillsList />
        </div>
      </div>
    </section>
  );
}
