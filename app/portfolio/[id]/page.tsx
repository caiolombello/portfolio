import { loadProjectById } from "@/lib/data";
import { serializeJsonLd } from "@/lib/json-ld";
import { getSiteConfig } from "@/lib/config-server";
import { isPortfolioEnabled } from "@/lib/site-features";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Github,
  Globe,
  Lock,
} from "lucide-react";
import { ContactCta } from "@/components/site/contact-cta";
import {
  ProjectCard,
  StatusBadge,
  TechList,
} from "@/components/site/project-card";
import { ProjectCover, projectTheme } from "@/components/site/project-cover";
import { SectionHeader } from "@/components/site/section-header";
import { getCopy } from "@/lib/locale/copy";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";

import { generatePageMetadata } from "@/lib/site-metadata";
import { getPerson, getProjects } from "@/lib/site-data";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const locale = await getCurrentRequestLocale();

  if (!isPortfolioEnabled(getSiteConfig())) {
    return generatePageMetadata({
      path: `/portfolio/${id}`,
      locale,
      title: locale === "pt" ? "Projeto indisponível" : "Project unavailable",
      description:
        locale === "pt"
          ? "Este projeto ainda não está disponível publicamente."
          : "This project is not publicly available yet.",
      noIndex: true,
    });
  }

  const project = await loadProjectById(id);

  if (!project) {
    return generatePageMetadata({
      path: `/portfolio/${id}`,
      locale,
      title: locale === "pt" ? "Projeto não encontrado" : "Project not found",
      description:
        locale === "pt"
          ? "O projeto solicitado não foi encontrado."
          : "The requested project could not be found.",
      noIndex: true,
    });
  }

  return generatePageMetadata({
    path: `/portfolio/${id}`,
    locale,
    title: locale === "pt" ? project.title_pt : project.title_en,
    description:
      locale === "pt"
        ? project.shortDescription_pt
        : project.shortDescription_en,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  if (!isPortfolioEnabled(getSiteConfig())) notFound();

  const { id } = await params;
  const locale = await getCurrentRequestLocale();
  const copy = getCopy(locale);
  const [projects, person] = await Promise.all([
    getProjects(locale),
    getPerson(locale),
  ]);
  const index = projects.findIndex((item) => item.id === id);

  if (index < 0) notFound();

  const project = projects[index];
  const sourceProject = await loadProjectById(id);
  if (!sourceProject) notFound();
  const caseStudy = sourceProject.caseStudy;
  const caseSections = [
    {
      title: locale === "en" ? "My role" : "Meu papel",
      text: locale === "en" ? caseStudy?.role_en : caseStudy?.role_pt,
    },
    {
      title: locale === "en" ? "Context" : "Contexto",
      text: locale === "en" ? caseStudy?.challenge_en : caseStudy?.challenge_pt,
    },
    {
      title: locale === "en" ? "Approach" : "Abordagem",
      text: locale === "en" ? caseStudy?.approach_en : caseStudy?.approach_pt,
    },
  ].filter((section) => Boolean(section.text));
  const outcomes =
    locale === "en" ? caseStudy?.outcomes_en : caseStudy?.outcomes_pt;
  const theme = projectTheme(project.id);
  const siteUrl = getSiteConfig().site.url;
  const others = [
    ...projects.slice(index + 1),
    ...projects.slice(0, index),
  ].slice(0, 3);

  const facts = [
    project.statusLabel && {
      label: copy.projects.status,
      value: project.statusLabel,
    },
    project.year && { label: copy.projects.year, value: String(project.year) },
    { label: copy.projects.category, value: project.categoryLabel },
    project.license && { label: copy.projects.license, value: project.license },
  ].filter(Boolean) as { label: string; value: string }[];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": project.githubUrl ? "SoftwareSourceCode" : "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${siteUrl}${project.href}`,
    ...(sourceProject.createdAt
      ? { datePublished: sourceProject.createdAt }
      : {}),
    ...(sourceProject.updatedAt
      ? { dateModified: sourceProject.updatedAt }
      : {}),
    inLanguage: locale === "pt" ? "Portuguese" : "English",
    genre: project.category,
    ...(project.imageUrl ? { image: project.imageUrl } : {}),
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
    author: { "@type": "Person", name: person.name, url: siteUrl },
    keywords: project.technologies.join(", "),
    ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
    ...(project.license ? { license: project.license } : {}),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />

      <header className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="bg-grid mask-radial-top absolute inset-0" />
          <div
            className="absolute left-1/2 top-[-22rem] h-[40rem] w-[70rem] -translate-x-1/2 opacity-60 dark:opacity-40"
            style={{
              background: `radial-gradient(closest-side, ${theme.accent}33, transparent)`,
            }}
          />
        </div>

        <div className="container pb-12 pt-8 lg:pb-16 lg:pt-12">
          <Link
            href={getLocalizedInstitutionalPath("/portfolio", locale)}
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            {copy.projects.back}
          </Link>

          <div className="mt-10 grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <div>
              <p className="eyebrow flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
                {project.categoryLabel}
              </p>
              <h1 className="mt-5 text-balance text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {project.title}
              </h1>
              {project.tagline && (
                <p className="mt-3 text-balance font-serif text-2xl italic leading-snug text-brand sm:text-3xl">
                  {project.tagline}
                </p>
              )}
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {project.summary}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-105"
                  >
                    <Globe className="h-4 w-4" aria-hidden="true" />
                    {copy.projects.website}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full border bg-card/70 px-5 text-sm font-semibold backdrop-blur transition-colors hover:border-foreground/25 hover:bg-accent"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    {copy.projects.repository}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="inline-flex h-11 items-center gap-2 rounded-full border border-dashed px-5 text-sm font-medium text-muted-foreground">
                    <Lock className="h-4 w-4" aria-hidden="true" />
                    {copy.projects.privateRepo}
                  </span>
                )}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="bg-card p-5 last:odd:col-span-2"
                >
                  <dt className="eyebrow">{fact.label}</dt>
                  <dd className="mt-2 font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border shadow-[0_40px_100px_-60px_rgba(0,0,0,0.6)] sm:aspect-[16/8]">
          <ProjectCover id={project.id} title={project.title} variant="hero" />
          <StatusBadge project={project} className="absolute left-4 top-4" />
        </div>
      </div>

      <div className="container grid grid-cols-1 gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16 lg:py-20">
        <div className="min-w-0">
          <section aria-labelledby="overview">
            <h2 id="overview" className="text-2xl font-semibold tracking-tight">
              {copy.projects.overview}
            </h2>
            <div className="mt-5 space-y-5 text-pretty text-[17px] leading-[1.8] text-foreground/85">
              {project.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </section>

          {caseSections.map((section) => (
            <section key={section.title} className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="mt-5 text-pretty text-[17px] leading-[1.8] text-foreground/85">
                {section.text}
              </p>
            </section>
          ))}
          {outcomes && outcomes.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">
                {locale === "en" ? "Outcomes" : "Resultados"}
              </h2>
              <ul className="mt-5 space-y-3">
                {outcomes.map((outcome: string) => (
                  <li
                    key={outcome}
                    className="flex gap-3 text-[17px] leading-[1.8] text-foreground/85"
                  >
                    <Check
                      className="mt-1 h-5 w-5 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.highlights.length > 0 && (
            <section aria-labelledby="highlights" className="mt-14">
              <h2
                id="highlights"
                className="text-2xl font-semibold tracking-tight"
              >
                {copy.projects.highlights}
              </h2>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {project.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex gap-3 rounded-2xl border bg-card p-5 text-[15px] leading-relaxed"
                  >
                    <span
                      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: `${theme.accent}22`,
                        color: theme.accent,
                      }}
                      aria-hidden="true"
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-foreground/85">{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section
            aria-labelledby="stack"
            className="rounded-2xl border bg-card p-6"
          >
            <h2 id="stack" className="eyebrow">
              {copy.projects.stack}
            </h2>
            <TechList technologies={project.technologies} className="mt-4" />
            {(sourceProject.createdAt || sourceProject.updatedAt) && (
              <dl className="mt-6 space-y-3 border-t pt-5 text-xs">
                {sourceProject.createdAt && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      {locale === "en" ? "Created" : "Criado"}
                    </dt>
                    <dd className="text-right">{sourceProject.createdAt}</dd>
                  </div>
                )}
                {sourceProject.updatedAt && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      {locale === "en" ? "Updated" : "Atualizado"}
                    </dt>
                    <dd className="text-right">{sourceProject.updatedAt}</dd>
                  </div>
                )}
              </dl>
            )}
          </section>

          <section
            aria-labelledby="links"
            className="rounded-2xl border bg-card p-6"
          >
            <h2 id="links" className="eyebrow">
              {copy.projects.links}
            </h2>
            <ul className="mt-4 space-y-1">
              {project.liveUrl && (
                <li>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-lg py-2 text-sm font-medium transition-colors hover:text-brand"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Globe
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      {copy.projects.website}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              )}
              {project.githubUrl ? (
                <li>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-lg py-2 text-sm font-medium transition-colors hover:text-brand"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Github
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      {copy.projects.repository}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ) : (
                <li className="flex gap-2.5 py-2 text-sm text-muted-foreground">
                  <Lock
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  {copy.projects.privateNote}
                </li>
              )}
            </ul>
          </section>
        </aside>
      </div>

      {others.length > 0 && (
        <section aria-labelledby="more-projects" className="container pb-8">
          <SectionHeader
            id="more-projects"
            eyebrow={copy.projects.title}
            title={copy.projects.more}
          />
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <li key={item.id} className="reveal">
                <ProjectCard project={item} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <ContactCta locale={locale} person={person} />
    </article>
  );
}
