"use client";

import { useEffect, useState } from "react";
import SkillBar from "./skill-bar";
import SectionHeading from "./section-heading";
import ExperienceItem from "./experience-item";
import EducationItem from "./education-item";
import ResumeDownload from "./resume-download";
import SkillsList from "./skill-bar";
import CredlyCertifications from "./credly-certifications";
import { useLanguage } from "@/contexts/language-context";
import { fetchCredlyBadges } from "@/lib/credly";
import { useSiteConfig } from "@/hooks/use-site-config";
import type { Skill } from "@/types/skill";

interface Experience {
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

interface Education {
  degree: string;
  institution: string;
  period: string;
  description?: string;
}

interface CredlyBadge {
  badge_template: {
    name: string;
  };
}

export default function Resume() {
  const { language } = useLanguage();
  const { config, loading: configLoading } = useSiteConfig();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<
    (string | { name: string })[]
  >([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [credlyCertifications, setCredlyCertifications] = useState<string[]>(
    [],
  );

  useEffect(() => {
    async function fetchData() {
      const expRes = await fetch("/api/public/experience");
      const eduRes = await fetch("/api/public/education");
      const skillsRes = await fetch("/api/skills");
      const expData = expRes.ok ? await expRes.json() : {};
      const eduData = eduRes.ok ? await eduRes.json() : {};
      const skillsData = skillsRes.ok
        ? await skillsRes.json()
        : { skills_list: [] };
      setExperiences(expData[language] || []);
      setEducations(eduData[language] || []);
      setSkills(skillsData.skills_list || []);
    }
    fetchData();
  }, [language]);

  useEffect(() => {
    async function loadCredlyCertifications() {
      if (!config.integrations.credlyUsername || config.integrations.credlyUsername === "your-credly-username") {
        return; // Skip if no Credly username configured
      }
      
      try {
        const badges = await fetchCredlyBadges(config.integrations.credlyUsername);
        const certificationNames = badges.map(
          (badge: CredlyBadge) => badge.badge_template.name,
        );
        setCredlyCertifications(certificationNames);
      } catch (error) {
        console.error("Error fetching Credly badges:", error);
      }
    }
    
    if (!configLoading) {
      loadCredlyCertifications();
    }
  }, [config.integrations.credlyUsername, configLoading]);

  const certificationsStrings = certifications.map((cert) =>
    typeof cert === "string" ? cert : cert.name,
  );

  const personalInfo = {
    name: config.site.shortName,
    title: config.site.author,
    location: config.site.location,
    email: config.site.email,
    phone: config.site.phone,
  };

  const summary = config?.site?.description || (
    language === "pt"
      ? "Engenheiro DevOps experiente com 3+ anos transformando operações através de automação e Cloud Native. Especialista em AWS, Kubernetes e Terraform com histórico comprovado: 70% redução no tempo de deploy, 40% menos incidentes através de observabilidade avançada, $200K+ economia anual para clientes via automação."
      : "Experienced DevOps Engineer with 3+ years transforming operations through automation and Cloud Native practices. Expert in AWS, Kubernetes and Terraform with proven track record: 70% deployment time reduction, 40% fewer incidents through advanced observability, $200K+ annual savings for clients via automation.");

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-gold text-center md:text-left mb-4 md:mb-0">
          {language === "pt" ? "Jornada Profissional" : "Professional Journey"}
        </h1>
        <ResumeDownload
          resumeData={{
            personalInfo,
            summary,
            experiences,
            education: educations,
            certifications: certificationsStrings,
            skills,
          }}
          certificationsCredly={credlyCertifications}
        />
      </div>

      {/* Seção de Experiência */}
      <section className="mb-16">
        <SectionHeading
          title={language === "pt" ? "Experiência" : "Experience"}
        />
        <div className="space-y-6">
          {experiences.map((experience, index) => (
            <ExperienceItem key={index} {...experience} />
          ))}
        </div>
      </section>

      {/* Seção de Educação */}
      <section className="mb-16">
        <SectionHeading title={language === "pt" ? "Educação" : "Education"} />
        <div className="space-y-6">
          {educations.map((education, index) => (
            <EducationItem key={index} {...education} />
          ))}
        </div>
      </section>

      {/* Seção de Certificações (Credly) */}
      <section className="mb-16">
        <SectionHeading
          title={
            language === "pt"
              ? "Certificações Profissionais"
              : "Professional Certifications"
          }
        />
        <CredlyCertifications />
      </section>

      {/* Seção de Skills */}
      <section className="mb-16">
        <SectionHeading title={language === "pt" ? "Habilidades" : "Skills"} />
        <SkillsList />
      </section>
    </div>
  );
}
