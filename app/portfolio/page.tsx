"use client";

import { Suspense, useEffect, useState } from "react";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { TechFilter } from "@/components/portfolio/tech-filter";
import { PortfolioStats } from "@/components/portfolio/portfolio-stats";
import { ProjectSkeleton } from "@/components/ui/loading-skeleton";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Project } from "@/types";

function PortfolioContent({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const projectsPerPage = 9;
  const displayedProjects = filteredProjects.slice(0, projectsPerPage);
  const hasMoreProjects = filteredProjects.length > projectsPerPage;

  // Atualizar projetos filtrados quando projects mudam
  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  const handleFilteredProjectsChange = (newFilteredProjects: Project[]) => {
    setFilteredProjects(newFilteredProjects);
  };

  const isFiltered = filteredProjects.length !== projects.length;
  const featuredCount = projects.filter(p => p.featured).length;

  return (
    <>
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
          <PortfolioGrid projects={displayedProjects} />
          
          {hasMoreProjects && (
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link href="/portfolio/page/2">
                  {t("projects.viewMore")}
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function PortfolioPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        {t("projects.title")}
      </h1>
      
      {loading ? (
        <ProjectSkeleton />
      ) : (
        <PortfolioContent projects={projects} />
      )}
    </div>
  );
}
