import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProjectsData } from "@/lib/data";
import { generatePageMetadata } from "@/lib/site-metadata";
import PortfolioPageHeader from "@/components/portfolio/portfolio-page-header";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { Button } from "@/components/ui/button";
import { getSiteConfig } from "@/lib/config-server";
import { isPortfolioEnabled } from "@/lib/site-features";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";

interface PageProps {
  params: Promise<{ page: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { page } = await params;
  const enabled = isPortfolioEnabled(getSiteConfig());
  const locale = await getCurrentRequestLocale();
  return generatePageMetadata({
    path: `/portfolio/page/${page}`,
    locale,
    title:
      locale === "pt" ? `Projetos · Página ${page}` : `Projects · Page ${page}`,
    description:
      locale === "pt"
        ? "Mais projetos de infraestrutura cloud, automação e engenharia de plataformas."
        : "More cloud infrastructure, automation, and platform engineering projects.",
    noIndex: !enabled,
  });
}

export default async function PortfolioPaginationPage({ params }: PageProps) {
  if (!isPortfolioEnabled(getSiteConfig())) notFound();

  const { page } = await params;
  const pageNumber = Number.parseInt(page, 10);
  const projects = await getProjectsData();
  const language = await getCurrentRequestLocale();
  const perPage = 9;
  const totalPages = Math.max(1, Math.ceil(projects.length / perPage));

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 2 ||
    pageNumber > totalPages
  )
    notFound();

  const paginatedProjects = projects.slice(
    (pageNumber - 1) * perPage,
    pageNumber * perPage,
  );

  return (
    <div className="container py-16 sm:py-20">
      <PortfolioPageHeader />
      <PortfolioGrid projects={paginatedProjects} />
      <nav
        className="mt-10 flex items-center justify-between border-t border-border/70 pt-6"
        aria-label={language === "en" ? "Pagination" : "Paginação"}
      >
        <Button asChild variant="outline">
          <Link
            href={getLocalizedInstitutionalPath(
              pageNumber === 2
                ? "/portfolio"
                : `/portfolio/page/${pageNumber - 1}`,
              language,
            )}
          >
            {language === "en" ? "Previous" : "Anterior"}
          </Link>
        </Button>
        {pageNumber < totalPages && (
          <Button asChild variant="outline">
            <Link
              href={getLocalizedInstitutionalPath(
                `/portfolio/page/${pageNumber + 1}`,
                language,
              )}
            >
              {language === "en" ? "Next" : "Próximo"}
            </Link>
          </Button>
        )}
      </nav>
    </div>
  );
}
