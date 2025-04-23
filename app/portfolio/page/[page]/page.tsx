"use client";

import { notFound } from "next/navigation";
import type { Project } from "@/types";
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
      } catch (error) {
        console.error("Error loading projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading || pageNumber === null) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-gold rounded-full border-t-transparent" />
      </div>
    );
  }

  const postsPerPage = 9;
  const start = (pageNumber - 1) * postsPerPage;
  const end = start + postsPerPage;

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

  const paginatedProjects = projects.slice(start, end);

  if (paginatedProjects.length === 0) {
    notFound();
  }

  const totalPages = Math.ceil(projects.length / postsPerPage);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        {t("projects.title")}
      </h1>

      <PortfolioGrid projects={paginatedProjects} />

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {pageNumber > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`/portfolio/page/${pageNumber - 1}`}>
                  {t("projects.pagination.previous")}
                </PaginationPrevious>
              </PaginationItem>
            )}

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
    </div>
  );
}
