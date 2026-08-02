"use client";

import { useLanguage } from "@/contexts/language-context";
import type { Project } from "@/types";

interface PortfolioStatsProps {
  totalProjects: number;
  filteredProjects: number;
  isFiltered: boolean;
  featuredCount: number;
}

export function PortfolioStats({ 
  totalProjects, 
  filteredProjects, 
  isFiltered, 
  featuredCount 
}: PortfolioStatsProps) {
  const { language } = useLanguage();

  if (totalProjects === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
      <div className="flex items-center gap-4">
        <div>
          {isFiltered ? (
            language === "en" ? (
              <>
                Showing <span className="font-medium text-gold">{filteredProjects}</span> of{" "}
                <span className="font-medium">{totalProjects}</span> projects
              </>
            ) : (
              <>
                Mostrando <span className="font-medium text-gold">{filteredProjects}</span> de{" "}
                <span className="font-medium">{totalProjects}</span> projetos
              </>
            )
          ) : (
            language === "en" ? (
              <>
                <span className="font-medium">{totalProjects}</span> projects total
              </>
            ) : (
              <>
                <span className="font-medium">{totalProjects}</span> projetos no total
              </>
            )
          )}
        </div>
        
        {!isFiltered && featuredCount > 0 && (
          <div className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs text-gold">
            {featuredCount} {language === "en" ? "featured" : "em destaque"}
          </div>
        )}
      </div>
      
      {isFiltered && (
        <div className="text-xs">
          {language === "en" ? "Filtered results" : "Resultados filtrados"}
        </div>
      )}
    </div>
  );
}
