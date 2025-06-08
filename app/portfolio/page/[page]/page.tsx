"use client";

import { notFound } from "next/navigation";
import type { Project } from "@/types";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { TechFilter } from "@/components/portfolio/tech-filter";
import { PortfolioStats } from "@/components/portfolio/portfolio-stats";
import { ProjectSkeleton } from "@/components/ui/loading-skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useLanguage } from "@/contexts/language-context";
import { useState, useEffect } from "react";

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export default function PortfolioPage({ params }: PageProps) {
  const [pageNumber, setPageNumber] = useState<number | null>(null);
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPage = async () => {
      const { page } = await params;
      const num = parseInt(page, 10);
      if (isNaN(num) || num < 1) {
        notFound();
      }
      setPageNumber(num);
    };
    initPage();
  }, [params]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/public/projects");
        const { projects: projectsData } = await response.json();
        setProjects(projectsData || []);
        setFilteredProjects(projectsData || []);
      } catch (error) {
        console.error("Error loading projects:", error);
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFilteredProjectsChange = (newFilteredProjects: Project[]) => {
    setFilteredProjects(newFilteredProjects);
  };

  if (loading || pageNumber === null) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          {t("projects.title")}
        </h1>
        <ProjectSkeleton />
      </div>
    );
  }

  const projectsPerPage = 9;
  const start = (pageNumber - 1) * projectsPerPage;
  const end = start + projectsPerPage;

  if (projects.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          {t("projects.title")}
        </h1>
        <p className="text-center text-gray-500">
          {t("projects.noProjects")}
        </p>
      </div>
    );
  }

  const paginatedProjects = filteredProjects.slice(start, end);
  const isFiltered = filteredProjects.length !== projects.length;
  const featuredCount = projects.filter(p => p.featured).length;

  if (!loading && paginatedProjects.length === 0 && pageNumber > 1) {
    notFound();
  }

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        {t("projects.title")}
      </h1>

      <TechFilter 
        projects={projects} 
        onFilteredProjectsChange={handleFilteredProjectsChange}
      />
      
      <PortfolioStats
        totalProjects={projects.length}
        filteredProjects={filteredProjects.length}
        isFiltered={isFiltered}
        featuredCount={featuredCount}
      />

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-muted-foreground mb-2">
            {t("projects.noProjectsWithFilters")}
          </h2>
          <p className="text-muted-foreground">
            {t("projects.tryDifferentFilters")}
          </p>
        </div>
      ) : (
        <>
          <PortfolioGrid projects={paginatedProjects} />

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {pageNumber > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href={pageNumber === 2 ? "/portfolio" : `/portfolio/page/${pageNumber - 1}`}>
                      {t("projects.pagination.previous")}
                    </PaginationPrevious>
                  </PaginationItem>
                )}

                {[...Array(totalPages)].map((_, idx) => {
                  const currentPage = idx + 1;
                  if (
                    currentPage === 1 ||
                    currentPage === totalPages ||
                    Math.abs(currentPage - pageNumber) <= 1
                  ) {
                    return (
                      <PaginationItem key={currentPage}>
                        <PaginationLink
                          href={currentPage === 1 ? "/portfolio" : `/portfolio/page/${currentPage}`}
                          isActive={currentPage === pageNumber}
                        >
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  if (
                    (currentPage === 2 && pageNumber > 3) ||
                    (currentPage === totalPages - 1 && pageNumber < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={currentPage + "-ellipsis"}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                {pageNumber < totalPages && (
                  <PaginationItem>
                    <PaginationNext href={`/portfolio/page/${pageNumber + 1}`}>
                      {t("projects.pagination.next")}
                    </PaginationNext>
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
