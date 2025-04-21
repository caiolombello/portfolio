import { notFound } from "next/navigation";
import { PortfolioGrid } from "@/components/portfolio-grid";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Suspense } from "react";
import { PortfolioGridSkeleton } from "@/components/loading-skeleton";
import type { Project } from "@/types";
import { getDictionary } from "@/app/i18n";
import { loadProjects } from "@/lib/data";

interface PageProps {
  params: Promise<{
    page: string;
    lang: string;
  }>;
}

async function PortfolioContent({
  projects,
  pageNumber,
  totalPages,
  lang,
  dict,
}: {
  projects: Project[];
  pageNumber: number;
  totalPages: number;
  lang: string;
  dict: Awaited<ReturnType<typeof getDictionary>>;
}) {
  return (
    <>
      <PortfolioGrid projects={projects} />

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {pageNumber > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`/${lang}/portfolio/page/${pageNumber - 1}`}
                >
                  Previous
                </PaginationPrevious>
              </PaginationItem>
            )}

            {pageNumber < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href={`/${lang}/portfolio/page/${pageNumber + 1}`}
                >
                  Next
                </PaginationNext>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

export default async function PortfolioPage({ params }: PageProps) {
  const { page, lang } = await params;
  const dict = await getDictionary(lang);
  const pageNumber = parseInt(page, 10);

  if (isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  const projects = await loadProjects();
  const projectsPerPage = 9;
  const start = (pageNumber - 1) * projectsPerPage;
  const end = start + projectsPerPage;
  const paginatedProjects = projects.slice(start, end);

  if (paginatedProjects.length === 0) {
    notFound();
  }

  const totalPages = Math.ceil(projects.length / projectsPerPage);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        {dict.projects.title}
      </h1>

      <Suspense fallback={<PortfolioGridSkeleton />}>
        <PortfolioContent
          projects={paginatedProjects}
          pageNumber={pageNumber}
          totalPages={totalPages}
          lang={lang}
          dict={dict}
        />
      </Suspense>
    </div>
  );
}
