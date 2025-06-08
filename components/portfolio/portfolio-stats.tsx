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
    <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
      <div className="flex items-center gap-4">
        <div>
          {isFiltered ? (
            language === "en" ? (
              <>
                Showing <span className="font-medium text-blue-600">{filteredProjects}</span> of{" "}
                <span className="font-medium">{totalProjects}</span> projects
              </>
            ) : (
              <>
                Mostrando <span className="font-medium text-blue-600">{filteredProjects}</span> de{" "}
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
          <div className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full">
            ⭐ {featuredCount} {language === "en" ? "featured" : "destaque"}
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