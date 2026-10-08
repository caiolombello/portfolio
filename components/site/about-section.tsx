import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bot,
  Languages,
  Layers,
  MapPin,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { Locale } from "@/app/i18n/settings";
import { getCopy } from "@/lib/locale/copy";
import type {
  Career,
  CertificationView,
  Person,
  ProjectView,
  SkillGroup,
} from "@/lib/site-data";
import { Certifications } from "./certifications";
import { projectTheme } from "./project-cover";
import { SectionHeader } from "./section-header";
import { LevelLegend, SkillMatrix, hasSkillLevels } from "./skill-matrix";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";

const FOCUS_ICONS = {
  layers: Layers,
  workflow: Workflow,
  activity: Activity,
  bot: Bot,
  shield: ShieldCheck,
} as const;

interface AboutSectionProps {
  locale: Locale;
  person: Person;
  career: Career;
  building: ProjectView[];
  skills: SkillGroup[];
  certifications: CertificationView[];
}

export function AboutSection({
  locale,
  person,
  career,
  building,
  skills,
  certifications,
}: AboutSectionProps) {
  const copy = getCopy(locale);
  const current = career.companies.find((company) => company.current);

  return (
    <section
      id="sobre"
      aria-labelledby="sobre-title"
      className="container scroll-mt-24 py-16 lg:py-24"
    >
      <SectionHeader
        id="sobre-title"
        eyebrow={copy.sections.about.eyebrow}
        title={copy.sections.about.title}
      />

      <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <article className="reveal rounded-2xl border bg-card p-6 sm:p-8 lg:col-span-7">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border sm:h-24 sm:w-24">
              <Image
                src={person.photo}
                alt={person.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-semibold tracking-tight">
                {person.name}
              </p>
              <p className="text-sm text-muted-foreground">{person.title}</p>
              <p className="mt-1.5 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {person.location}
              </p>
              {person.languages.length > 0 && (
                <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <Languages
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  {person.languages
                    .map(
                      (language) =>
                        `${language.name} (${language.level.toLowerCase()})`,
                    )
                    .join(" · ")}
                </p>
              )}
            </div>
          </div>
          <p className="mt-7 text-pretty text-[15.5px] leading-[1.8] text-foreground/85">
            {person.about}
          </p>
        </article>

        <aside className="reveal flex flex-col rounded-2xl border bg-card p-6 sm:p-8 lg:col-span-5">
          <p className="eyebrow">{copy.sections.about.now}</p>
          {current && (
            <div className="mt-4">
              <p className="text-lg font-semibold tracking-tight">
                {career.currentRole?.title ?? person.role}
              </p>
              <p className="text-sm text-muted-foreground">
                {current.company} · {current.period}
              </p>
            </div>
          )}

          {building.length > 0 && (
            <>
              <p className="eyebrow mt-8">{copy.sections.about.building}</p>
              <ul className="mt-3 divide-y divide-border/70">
                {building.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={project.href}
                      className="group flex items-center gap-3 py-3 text-sm"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor: projectTheme(project.id).accent,
                        }}
                        aria-hidden="true"
                      />
                      <span className="font-medium transition-colors group-hover:text-brand">
                        {project.title}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-muted-foreground">
                        {project.tagline}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <Link
            href={getLocalizedInstitutionalPath(
              "/resume",
              locale === "pt" ? "pt" : "en",
            )}
            className="group mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {copy.sections.experience.viewResume}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </aside>

        {person.focus.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-12 xl:grid-cols-4">
            {person.focus.map((area) => {
              const Icon =
                FOCUS_ICONS[area.icon as keyof typeof FOCUS_ICONS] ?? Sparkles;
              return (
                <article
                  key={area.title}
                  className="reveal group rounded-2xl border bg-card p-6"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background text-brand transition-colors group-hover:border-primary/40">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-semibold tracking-tight">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {area.description}
                  </p>
                </article>
              );
            })}
          </div>
        )}

        {skills.length > 0 && (
          <article className="reveal rounded-2xl border bg-card p-6 sm:p-8 lg:col-span-12">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h3 className="text-lg font-semibold tracking-tight">
                {copy.sections.about.stackTitle}
              </h3>
              {hasSkillLevels(skills) && <LevelLegend locale={locale} />}
            </div>
            <div className="mt-6">
              <SkillMatrix skills={skills} />
            </div>
          </article>
        )}

        {certifications.length > 0 && (
          <article className="reveal rounded-2xl border bg-card p-6 sm:p-8 lg:col-span-12">
            <h3 className="mb-5 text-lg font-semibold tracking-tight">
              {copy.resume.certifications}
            </h3>
            <Certifications
              locale={locale}
              certifications={certifications}
              credlyUsername={person.credlyUsername}
            />
          </article>
        )}
      </div>
    </section>
  );
}
