import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Github,
  ExternalLink,
  Layers3,
} from "lucide-react";
import { generateJsonLd, generatePageMetadata } from "@/lib/site-metadata";
import type { Metadata } from "next";
import type { Project, Technology } from "@/types/project";
import { loadProjectById } from "@/lib/data";
import { getDictionary } from "@/app/i18n";
import { getSiteConfig } from "@/lib/config-server";
import { isPortfolioEnabled } from "@/lib/site-features";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";

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
  const project = await loadProjectById(id);
  if (!project) notFound();

  const cookieStore = await cookies();
  const language = cookieStore.get("NEXT_LOCALE")?.value === "en" ? "en" : "pt";
  const dict = await getDictionary(language);
  const title = language === "en" ? project.title_en : project.title_pt;
  const shortDescription =
    language === "en"
      ? project.shortDescription_en
      : project.shortDescription_pt;
  const description =
    language === "en" ? project.description_en : project.description_pt;
  const caseStudy = project.caseStudy;
  const role = language === "en" ? caseStudy?.role_en : caseStudy?.role_pt;
  const challenge =
    language === "en" ? caseStudy?.challenge_en : caseStudy?.challenge_pt;
  const approach =
    language === "en" ? caseStudy?.approach_en : caseStudy?.approach_pt;
  const outcomes =
    language === "en" ? caseStudy?.outcomes_en : caseStudy?.outcomes_pt;

  return (
    <div className="container py-12 sm:py-16">
      <nav aria-label={language === "en" ? "Breadcrumb" : "Breadcrumbs"}>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {dict.projects.backToPortfolio}
        </Link>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: title,
            description: shortDescription,
            image: project.imageUrl ?? "",
            url: `${getSiteConfig().site.url}/portfolio/${project.id}`,
            datePublished: project.createdAt,
            dateModified: project.updatedAt,
            inLanguage: language === "pt" ? "Portuguese" : "English",
            genre: project.category,
            keywords:
              project.technologies
                ?.map((tech: Technology) => tech.tech)
                .join(", ") ?? "",
            ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
            ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
          })}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:gap-16">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/80 bg-secondary">
          <Image
            src={project.imageUrl ?? "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 65vw"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
            {project.category || "Project"}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {shortDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-gold/90"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                {dict.projects.viewDemo}
              </Link>
            )}
            {project.githubUrl && (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border/80 px-4 py-2.5 text-sm font-medium transition-colors hover:border-gold/50 hover:text-gold"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                {dict.projects.githubRepo}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-10 border-t border-border/70 pt-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
        <article className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
            {dict.projects.projectDetails}
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            {description}
          </h2>

          {role && (
            <section className="mt-10">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
                {language === "en" ? "My role" : "Meu papel"}
              </h3>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {role}
              </p>
            </section>
          )}
          {challenge && (
            <section className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
                {language === "en" ? "Context" : "Contexto"}
              </h3>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {challenge}
              </p>
            </section>
          )}
          {approach && (
            <section className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
                {language === "en" ? "Approach" : "Abordagem"}
              </h3>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {approach}
              </p>
            </section>
          )}
          {outcomes && outcomes.length > 0 && (
            <section className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
                {language === "en" ? "Outcomes" : "Resultados"}
              </h3>
              <ul className="mt-3 space-y-3 text-base leading-7 text-muted-foreground">
                {outcomes.map((outcome: string) => (
                  <li key={outcome} className="flex gap-3">
                    <span
                      className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                      aria-hidden="true"
                    />
                    {outcome}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        <aside className="h-fit rounded-2xl border border-border/80 bg-card/50 p-5 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Layers3 className="h-4 w-4 text-gold" aria-hidden="true" />
            {dict.projects.technologiesUsed}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies?.map((tech: Technology) => (
              <span
                key={tech.tech}
                className="rounded-full border border-border/80 bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground"
              >
                {tech.tech}
              </span>
            ))}
          </div>
          {(project.createdAt || project.updatedAt) && (
            <dl className="mt-6 space-y-3 border-t border-border/70 pt-5 text-xs">
              {project.createdAt && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">
                    {language === "en" ? "Created" : "Criado"}
                  </dt>
                  <dd className="text-right text-foreground">
                    {project.createdAt}
                  </dd>
                </div>
              )}
              {project.updatedAt && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">
                    {language === "en" ? "Updated" : "Atualizado"}
                  </dt>
                  <dd className="text-right text-foreground">
                    {project.updatedAt}
                  </dd>
                </div>
              )}
            </dl>
          )}
        </aside>
      </div>
    </div>
  );
}
