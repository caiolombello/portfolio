"use client";

import Link from "next/link";
import { ArrowUpRight, Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Reveal } from "@/components/motion/reveal";
import { formatResumePeriod } from "@/lib/resume/period";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";

interface Responsibility {
  item: string;
}

interface ExperienceRecord {
  company: string;
  title_pt: string;
  title_en: string;
  period: string;
  responsibilities_pt: Responsibility[];
  responsibilities_en: Responsibility[];
  startDate?: string;
  endDate?: string;
}

interface ExperienceSnapshotProps {
  experiences: ExperienceRecord[];
}

export default function ExperienceSnapshot({
  experiences = [],
}: ExperienceSnapshotProps) {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const visibleExperiences = experiences.slice(0, 3);

  if (visibleExperiences.length === 0) return null;

  return (
    <section
      className="container relative border-b border-border/70 py-14 [--timeline-content:3rem] [--timeline-padding:1rem] [--timeline-rail:3rem] sm:py-24 sm:[--timeline-content:5rem] sm:[--timeline-rail:3.5rem]"
      aria-labelledby="experience-snapshot-title"
    >
      <div
        className="timeline-rail absolute inset-y-0 left-[var(--timeline-rail)]"
        aria-hidden="true"
      />

      <div className="pl-[var(--timeline-content)]">
        <Reveal
          className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
          offset={16}
        >
          <span
            className="timeline-marker absolute left-[calc(var(--timeline-rail)-var(--timeline-padding)-var(--timeline-content)-0.375rem)] top-1 h-3 w-3 rounded-full border-2 border-gold bg-background"
            aria-hidden="true"
          />
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              {isEnglish ? "Experience" : "Experiência"}
            </p>
            <h2
              id="experience-snapshot-title"
              className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
            >
              {isEnglish
                ? "A career built around reliable delivery."
                : "Uma carreira construída em torno de entregas confiáveis."}
            </h2>
          </div>
          <Link
            href={getLocalizedInstitutionalPath(
              "/resume",
              isEnglish ? "en" : "pt",
            )}
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-foreground"
          >
            {isEnglish ? "View full experience" : "Ver experiência completa"}
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6">
          {visibleExperiences.map((experience, index) => {
            const responsibilities = isEnglish
              ? experience.responsibilities_en
              : experience.responsibilities_pt;
            const period = formatResumePeriod(
              experience.startDate,
              experience.endDate,
              experience.period,
              isEnglish ? "en" : "pt",
            );

            return (
              <Reveal
                key={`${experience.company}-${experience.period}`}
                className="relative"
                delay={index * 0.07}
                offset={18}
              >
                <span
                  className="timeline-marker absolute left-[calc(var(--timeline-rail)-var(--timeline-padding)-var(--timeline-content)-0.375rem)] top-7 h-3 w-3 rounded-full border-2 border-gold bg-background"
                  aria-hidden="true"
                />
                <article className="surface-motion group grid gap-5 rounded-xl border border-border/70 bg-card/40 p-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8 sm:p-6">
                  <div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
                      <Briefcase className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="mt-4 block font-mono text-[11px] uppercase leading-5 tracking-[0.12em] text-muted-foreground">
                      {period}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(visibleExperiences.length).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                      {isEnglish ? experience.title_en : experience.title_pt}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-gold">
                      {experience.company}
                    </p>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {responsibilities[0]?.item}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
