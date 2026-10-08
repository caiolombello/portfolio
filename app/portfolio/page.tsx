import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/config-server";
import { isPortfolioEnabled } from "@/lib/site-features";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactCta } from "@/components/site/contact-cta";
import { ProjectCard } from "@/components/site/project-card";
import { SectionHeader } from "@/components/site/section-header";
import { fill, getCopy } from "@/lib/locale/copy";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";
import { getPerson, getProjects } from "@/lib/site-data";
import { generatePageMetadata } from "@/lib/site-metadata";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const enabled = isPortfolioEnabled(getSiteConfig());
  const locale = await getCurrentRequestLocale();
  return generatePageMetadata({
    path: "/portfolio",
    locale,
    title: locale === "pt" ? "Projetos" : "Projects",
    description:
      locale === "pt"
        ? "Projetos selecionados de infraestrutura cloud, automação e engenharia de plataformas."
        : "Selected cloud infrastructure, automation, and platform engineering projects.",
    noIndex: !enabled,
  });
}

interface PortfolioPageProps {
  searchParams: Promise<{
    category?: string | string[];
    q?: string | string[];
    technology?: string | string[];
  }>;
}

export default async function PortfolioPage({
  searchParams,
}: PortfolioPageProps) {
  if (!isPortfolioEnabled(getSiteConfig())) notFound();

  const { category, q, technology } = await searchParams;
  const locale = await getCurrentRequestLocale();
  const copy = getCopy(locale);
  const [projects, person] = await Promise.all([
    getProjects(locale),
    getPerson(locale),
  ]);

  const categories = Array.from(
    new Set(projects.map((project) => project.category).filter(Boolean)),
  ).map((key) => ({
    key,
    label: copy.projects.categories[key] ?? key,
    count: projects.filter((project) => project.category === key).length,
  }));
  const requested = Array.isArray(category) ? category[0] : category;
  const active = categories.some((item) => item.key === requested)
    ? requested
    : undefined;
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const technologies = Array.from(
    new Set(projects.flatMap((project) => project.technologies)),
  ).sort();
  const selectedTechnologies = (
    Array.isArray(technology) ? technology : technology ? [technology] : []
  ).filter((value) => technologies.includes(value));
  const filtered = projects.filter(
    (project) =>
      (!active || project.category === active) &&
      (!selectedTechnologies.length ||
        selectedTechnologies.some((value) =>
          project.technologies.includes(value),
        )) &&
      (!query ||
        `${project.title} ${project.summary}`
          .toLowerCase()
          .includes(query.toLowerCase())),
  );
  const visible = filtered.slice(0, 9);
  const totalPages = Math.max(1, Math.ceil(filtered.length / 9));
  const filterHref = (path: string, nextCategory = active) => {
    const parameters = new URLSearchParams();
    if (nextCategory) parameters.set("category", nextCategory);
    if (query) parameters.set("q", query);
    selectedTechnologies.forEach((value) =>
      parameters.append("technology", value),
    );
    const suffix = parameters.toString();
    return `${getLocalizedInstitutionalPath(path, locale)}${suffix ? `?${suffix}` : ""}`;
  };

  const chip = (selected: boolean) =>
    cn(
      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
      selected
        ? "border-foreground bg-foreground text-background"
        : "border-border/80 bg-card/60 text-muted-foreground hover:border-foreground/25 hover:text-foreground",
    );

  return (
    <>
      <div className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="bg-grid mask-radial-top pointer-events-none absolute inset-0 -z-10"
        />
        <div className="container pb-10 pt-12 lg:pb-14 lg:pt-20">
          <SectionHeader
            as="h1"
            eyebrow={fill(copy.projects.count, { count: projects.length })}
            title={copy.projects.title}
            description={copy.projects.description}
          />

          <form
            key={JSON.stringify([active, query, selectedTechnologies])}
            action={getLocalizedInstitutionalPath("/portfolio", locale)}
            method="get"
            className="mt-8 rounded-2xl border bg-card/60 p-4 sm:p-5"
          >
            {active && <input type="hidden" name="category" value={active} />}
            <div className="flex flex-wrap items-end gap-3">
              <label className="min-w-0 flex-1 text-sm font-medium">
                {locale === "en" ? "Search projects" : "Buscar projetos"}
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  className="mt-2 h-11 w-full rounded-xl border bg-background/60 px-3 text-base"
                />
              </label>
              <button
                type="submit"
                className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
              >
                {locale === "en" ? "Apply filters" : "Aplicar filtros"}
              </button>
              {(active || query || selectedTechnologies.length > 0) && (
                <Link
                  href={getLocalizedInstitutionalPath("/portfolio", locale)}
                  className="inline-flex h-11 items-center px-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  {locale === "en" ? "Clear filters" : "Limpar filtros"}
                </Link>
              )}
            </div>
            {technologies.length > 0 && (
              <details className="mt-4" open={selectedTechnologies.length > 0}>
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                  {locale === "en"
                    ? "Filter by technology"
                    : "Filtrar por tecnologia"}
                </summary>
                <fieldset className="mt-3 flex flex-wrap gap-2">
                  <legend className="sr-only">
                    {locale === "en" ? "Technologies" : "Tecnologias"}
                  </legend>
                  {technologies.map((value) => (
                    <label
                      key={value}
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs text-muted-foreground"
                    >
                      <input
                        type="checkbox"
                        name="technology"
                        value={value}
                        defaultChecked={selectedTechnologies.includes(value)}
                        className="accent-primary"
                      />
                      {value}
                    </label>
                  ))}
                </fieldset>
              </details>
            )}
          </form>

          <nav aria-label={copy.projects.filterLabel} className="mt-10">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link
                  href={filterHref("/portfolio", "")}
                  scroll={false}
                  aria-current={!active ? "page" : undefined}
                  className={chip(!active)}
                >
                  {copy.projects.all}
                  <span className="font-mono text-xs opacity-60">
                    {projects.length}
                  </span>
                </Link>
              </li>
              {categories.map((item) => (
                <li key={item.key}>
                  <Link
                    href={filterHref("/portfolio", item.key)}
                    scroll={false}
                    aria-current={active === item.key ? "page" : undefined}
                    className={chip(active === item.key)}
                  >
                    {item.label}
                    <span className="font-mono text-xs opacity-60">
                      {item.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-5 font-mono text-xs text-muted-foreground">
            {locale === "en"
              ? `${filtered.length} of ${projects.length} projects · ${projects.filter((project) => project.featured).length} featured`
              : `${filtered.length} de ${projects.length} projetos · ${projects.filter((project) => project.featured).length} em destaque`}
          </p>
        </div>
      </div>

      <section className="container pb-8" aria-live="polite">
        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
            {copy.projects.empty}
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <li key={project.id} className="reveal">
                <ProjectCard project={project} headingLevel="h2" />
              </li>
            ))}
          </ul>
        )}
      </section>

      {totalPages > 1 && (
        <nav
          className="container flex justify-end pb-8"
          aria-label={locale === "en" ? "Pagination" : "Paginação"}
        >
          <Link
            href={filterHref("/portfolio/page/2")}
            className="inline-flex h-11 items-center rounded-full border bg-card/70 px-5 text-sm font-semibold hover:border-foreground/25"
          >
            {locale === "en" ? "View more projects" : "Ver mais projetos"}
          </Link>
        </nav>
      )}
      <ContactCta locale={locale} person={person} />
    </>
  );
}
