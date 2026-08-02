"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { TechFilter } from "@/components/portfolio/tech-filter";
import { PortfolioStats } from "@/components/portfolio/portfolio-stats";
import type { Project } from "@/types";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";

interface PortfolioBrowserProps {
  projects: Project[];
}

export default function PortfolioBrowser({ projects }: PortfolioBrowserProps) {
  const { language } = useLanguage();
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const isEnglish = language === "en";
  const projectsPerPage = 9;
  const displayedProjects = filteredProjects.slice(0, projectsPerPage);
  const hasMoreProjects = filteredProjects.length > projectsPerPage;

  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  const handleFilteredProjectsChange = useCallback((nextProjects: Project[]) => {
    setFilteredProjects(nextProjects);
  }, []);

  return (
    <>
      <TechFilter projects={projects} onFilteredProjectsChange={handleFilteredProjectsChange} />
      <PortfolioStats
        totalProjects={projects.length}
        filteredProjects={filteredProjects.length}
        isFiltered={filteredProjects.length !== projects.length}
        featuredCount={projects.filter((project) => project.featured).length}
      />

      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-10 text-center">
          <h2 className="text-xl font-semibold">{isEnglish ? "No projects match these filters." : "Nenhum projeto corresponde a esses filtros."}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{isEnglish ? "Try a different search or clear the active filters." : "Tente outra busca ou limpe os filtros ativos."}</p>
        </div>
      ) : (
        <>
          <PortfolioGrid projects={displayedProjects} />
          {hasMoreProjects && (
            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link href={getLocalizedInstitutionalPath("/portfolio/page/2", isEnglish ? "en" : "pt")}>
                  {isEnglish ? "View more projects" : "Ver mais projetos"}
                  <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
