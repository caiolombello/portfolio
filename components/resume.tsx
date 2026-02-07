"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "./section-heading";
import ExperienceItem from "./experience-item";
import EducationItem from "./education-item";
import ResumeDownload from "./resume-download";
import SkillsList from "./skill-bar";
import CredlyCertifications from "./credly-certifications";
import { useLanguage } from "@/contexts/language-context";
import { fetchCredlyBadges } from "@/lib/credly";
import { useSiteConfig } from "@/hooks/use-site-config";
import { Briefcase, GraduationCap, Award, Wrench } from "lucide-react";
import type { Skill } from "@/types/skill";
import type { Profile } from "@/types/profile";

interface Experience {
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

interface Education {
  degree: string;
  institution: string;
  logo?: string;
  institutionUrl?: string;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [credlyCertifications, setCredlyCertifications] = useState<string[]>([]);
  const [hasCredly, setHasCredly] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [expRes, eduRes, skillsRes, profileRes] = await Promise.all([
        fetch("/api/public/experience"),
        fetch("/api/public/education"),
        fetch("/api/skills"),
        fetch("/api/public/profile"),
      ]);

      const expData = expRes.ok ? await expRes.json() : {};
      const eduData = eduRes.ok ? await eduRes.json() : {};
      const skillsData = skillsRes.ok
        ? await skillsRes.json()
        : { skills_list: [] };
      const profileData = profileRes.ok ? await profileRes.json() : null;

      setExperiences(expData[language] || []);
      setEducations(eduData[language] || []);
      setSkills(skillsData.skills_list || []);
      setProfile(profileData);
    }
    fetchData();
  }, [language]);

  useEffect(() => {
    async function loadCredlyCertifications() {
      const username = config.integrations.credlyUsername;
      if (!username || username === "your-credly-username") {
        return;
      }

      try {
        const badges = await fetchCredlyBadges(username);
        const certificationNames = badges.map(
          (badge: CredlyBadge) => badge.badge_template.name,
        );
        setCredlyCertifications(certificationNames);
        setHasCredly(true);
      } catch (error) {
        console.error("Error fetching Credly badges:", error);
      }
    }

    if (!configLoading) {
      const username = config.integrations.credlyUsername;
      if (username && username !== "your-credly-username") {
        setHasCredly(true);
      }
      loadCredlyCertifications();
    }
  }, [config.integrations.credlyUsername, configLoading]);

  const currentProfile = profile?.[language] || {
    name: "",
    title: "",
    location: "",
    about: "",
  };

  const personalInfo = {
    name: currentProfile.name || config.site.shortName,
    title: currentProfile.title || config.site.author,
    location: currentProfile.location || config.site.location,
    email: config.site.email,
    phone: config.site.phone,
  };

  const summary = currentProfile.about || config?.site?.description;

  return (
    <div className="container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gold text-center md:text-left mb-4 md:mb-0" suppressHydrationWarning>
          {language === "pt" ? "Jornada Profissional" : "Professional Journey"}
        </h1>
        <ResumeDownload
          resumeData={{
            personalInfo,
            summary,
            experiences,
            education: educations,
            certifications: credlyCertifications,
            skills,
          }}
          certificationsCredly={credlyCertifications}
        />
      </motion.div>

      {/* Experience */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <SectionHeading
          title={language === "pt" ? "Experiência" : "Experience"}
          icon={Briefcase}
        />
        {experiences.length > 0 ? (
          <div className="relative space-y-8">
            {experiences.map((experience, index) => (
              <ExperienceItem key={index} {...experience} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            {language === "pt"
              ? "Adicione suas experiências em content/experience/"
              : "Add your experiences in content/experience/"}
          </p>
        )}
      </motion.section>

      {/* Education */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <SectionHeading title={language === "pt" ? "Educação" : "Education"} icon={GraduationCap} />
        {educations.length > 0 ? (
          <div className="relative space-y-8">
            {educations.map((education, index) => (
              <EducationItem key={index} {...education} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            {language === "pt"
              ? "Adicione sua formação em content/education/"
              : "Add your education in content/education/"}
          </p>
        )}
      </motion.section>

      {/* Certifications (Credly) — only shown when configured */}
      {hasCredly && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <SectionHeading
            title={
              language === "pt"
                ? "Certificações Profissionais"
                : "Professional Certifications"
            }
            icon={Award}
          />
          <CredlyCertifications />
        </motion.section>
      )}

      {/* Skills */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <SectionHeading title={language === "pt" ? "Habilidades" : "Skills"} icon={Wrench} />
        <SkillsList />
      </motion.section>
    </div>
  );
}
