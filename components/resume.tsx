"use client";

import { motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Download,
  GraduationCap,
  Mail,
  MapPin,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import SectionHeading from "./section-heading";
import ExperienceItem from "./experience-item";
import EducationItem from "./education-item";
import ResumeDownload from "./resume-download";
import SkillsList from "./skill-bar";
import CredlyCertifications from "./credly-certifications";
import { useLanguage } from "@/contexts/language-context";
import { useSiteConfig } from "@/hooks/use-site-config";
import type { ResumeModels } from "@/lib/resume/model";

interface ResumeProps {
  models: ResumeModels;
}

export default function Resume({ models }: ResumeProps) {
  const { language } = useLanguage();
  const { config, loading: configLoading } = useSiteConfig();
  const isEnglish = language === "en";
  const currentModel = models[isEnglish ? "en" : "pt"];
  const { personalInfo, summary } = currentModel;
  const hasCredly =
    !configLoading &&
    Boolean(
      config.integrations.credlyUsername &&
        config.integrations.credlyUsername !== "your-credly-username",
    );

  return (
    <div className="container py-16 sm:py-20">
      <motion.header
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col justify-between gap-8 border-b border-border/70 pb-12 lg:flex-row lg:items-end"
      >
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
            {isEnglish ? "Resume" : "Currículo"}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            {isEnglish
              ? "A clear view of how I build."
              : "Uma visão clara de como eu construo."}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {summary}
          </p>
        </div>
        <ResumeDownload />
      </motion.header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
        <div>
          <motion.section
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            className="mb-16"
          >
            <SectionHeading
              title={isEnglish ? "Experience" : "Experiência"}
              icon={Briefcase}
            />
            {currentModel.experiences.length > 0 ? (
              <div className="relative space-y-7">
                {currentModel.experiences.map((experience, index) => (
                  <ExperienceItem
                    key={`${experience.company}-${experience.period}`}
                    {...experience}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border/80 p-8 text-center text-sm text-muted-foreground">
                {isEnglish
                  ? "No experience published yet."
                  : "Nenhuma experiência publicada ainda."}
              </p>
            )}
          </motion.section>

          <motion.section
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            className="mb-16"
          >
            <SectionHeading
              title={isEnglish ? "Education" : "Educação"}
              icon={GraduationCap}
            />
            {currentModel.education.length > 0 ? (
              <div className="relative space-y-7">
                {currentModel.education.map((item, index) => (
                  <EducationItem
                    key={`${item.institution}-${item.period}`}
                    {...item}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border/80 p-8 text-center text-sm text-muted-foreground">
                {isEnglish
                  ? "No education published yet."
                  : "Nenhuma formação publicada ainda."}
              </p>
            )}
          </motion.section>

          {hasCredly && (
            <motion.section
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              className="mb-16"
            >
              <SectionHeading
                title={isEnglish ? "Certifications" : "Certificações"}
                icon={Award}
              />
              <CredlyCertifications />
            </motion.section>
          )}

          <motion.section
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            <SectionHeading
              title={isEnglish ? "Skills" : "Habilidades"}
              icon={Wrench}
            />
            <SkillsList initialSkills={currentModel.skills} />
          </motion.section>
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border/80 bg-card/50 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
              {isEnglish ? "Contact" : "Contato"}
            </p>
            <p className="mt-4 text-lg font-semibold">{personalInfo.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {personalInfo.title}
            </p>
            <div className="mt-6 space-y-3 border-t border-border/70 pt-5 text-sm">
              <p className="flex items-start gap-2 text-muted-foreground">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                  aria-hidden="true"
                />
                {personalInfo.location}
              </p>
              <Link
                href={`mailto:${personalInfo.email}`}
                className="flex items-start gap-2 break-all text-muted-foreground transition-colors hover:text-gold"
              >
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                  aria-hidden="true"
                />
                {personalInfo.email}
              </Link>
            </div>
          </div>
          <Link
            href={isEnglish ? "/en/contact" : "/contact"}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold/90"
          >
            {isEnglish ? "Get in touch" : "Entrar em contato"}
            <Download className="h-4 w-4 rotate-[-90deg]" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
