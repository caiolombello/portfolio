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
      try {
        const badges = await fetchCredlyBadges("caiolombello");
        const certificationNames = badges.map(
          (badge: CredlyBadge) => badge.badge_template.name,
        );
        setCredlyCertifications(certificationNames);
      } catch (error) {
        console.error("Error fetching Credly badges:", error);
      }
    }
    loadCredlyCertifications();
  }, []);

  const certificationsStrings = certifications.map((cert) =>
    typeof cert === "string" ? cert : cert.name,
  );

  const personalInfo = {
    name: "Caio Barbieri",
    title: "DevOps Engineer",
    location: "Campinas, SP",
    email: "caio@lombello.com",
    phone: "+55 (19) 99753-6692",
  };

  const summary =
    language === "pt"
      ? "Engenheiro DevOps com expertise em Cloud Native, Observabilidade, automação de infraestrutura e CI/CD."
      : "DevOps Engineer with expertise in Cloud Native, Observability, infrastructure automation, and CI/CD.";

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
