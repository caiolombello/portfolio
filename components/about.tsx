"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  MessageCircle,
  CalendarPlus,
} from "lucide-react";
import SkillsList from "./skill-bar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useSiteConfig } from "@/hooks/use-site-config";
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
  const { config } = useSiteConfig();
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
  const githubUsername = config.social.github?.split("/").pop() || "";
  const linkedinUsername = config.social.linkedin?.split("/").pop() || "";
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

          <div className="w-full flex flex-col items-center md:items-start gap-3">
            <Button variant="outline" asChild className="w-full max-w-xs justify-start gap-3">
              <Link href={`mailto:${profile.email}`}>
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full max-w-xs justify-start gap-3">
              <Link href={`tel:${profile.phone}`}>
                <Phone className="h-4 w-4" />
                <span>{profile.phone}</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full max-w-xs justify-start gap-3">
              <Link href={config.social.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span>{githubUsername}</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full max-w-xs justify-start gap-3">
              <Link href={config.social.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                <span>{linkedinUsername}</span>
              </Link>
            </Button>

            <div className="w-full max-w-xs pt-2 flex flex-col gap-3">
                <Button asChild className="w-full justify-center gap-2 bg-green-600 hover:bg-green-700">
                    <Link href="https://wa.me/5519997536692" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                    </Link>
                </Button>

                {config?.social?.calendarUrl && (
                    <Button asChild className="w-full justify-center gap-2 bg-green-600 hover:bg-green-700">
                        <Link href={config.social.calendarUrl} target="_blank" rel="noopener noreferrer">
                            <CalendarPlus className="h-4 w-4" />
                            {language === 'pt' ? 'Agendar reunião' : 'Schedule meeting'}
                        </Link>
                    </Button>
                )}
            </div>
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
