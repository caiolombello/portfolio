"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Filter, Code } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { Project } from "@/types";

interface TechFilterProps {
  projects: Project[];
  onFilteredProjectsChange: (filteredProjects: Project[]) => void;
}

export function TechFilter({ projects, onFilteredProjectsChange }: TechFilterProps) {
  const { language } = useLanguage();
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  
  // Extrair todas as tecnologias únicas dos projetos
  const allTechs = Array.from(
    new Set(
      projects.flatMap(project => 
        project.technologies?.map(tech => tech.tech) || []
      )
    )
  ).sort();

  // Filtrar projetos com base nas tecnologias selecionadas
  useEffect(() => {
    if (selectedTechs.length === 0) {
      onFilteredProjectsChange(projects);
    } else {
      const filtered = projects.filter(project => 
        selectedTechs.some(tech => 
          project.technologies?.some(projectTech => projectTech.tech === tech)
        )
      );
      onFilteredProjectsChange(filtered);
    }
  }, [selectedTechs, projects, onFilteredProjectsChange]);

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const clearFilters = () => {
    setSelectedTechs([]);
  };

  if (allTechs.length === 0) {
    return null; // Não mostrar filtro se não há tecnologias
  }

  return (
    <div className="mb-8 space-y-4 rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">
            {language === "en" ? "Filter by technology" : "Filtrar por tecnologia"}
          </h3>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            {allTechs.length} {language === "en" ? "technologies" : "tecnologias"}
          </span>
        </div>
        {selectedTechs.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            {language === "en" ? "Clear" : "Limpar"}
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {allTechs.map(tech => {
          const isSelected = selectedTechs.includes(tech);
          const projectCount = projects.filter(project => 
            project.technologies?.some(projectTech => projectTech.tech === tech)
          ).length;
          
          return (
            <Badge
              key={tech}
              variant={isSelected ? "default" : "secondary"}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                isSelected 
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" 
                  : "hover:bg-blue-100 dark:hover:bg-blue-900/50"
              }`}
              onClick={() => toggleTech(tech)}
            >
              {tech}
              <span className="ml-1 text-xs opacity-75">
                ({projectCount})
              </span>
            </Badge>
          );
        })}
      </div>

      {selectedTechs.length > 0 && (
        <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 rounded-md p-3">
          <div className="font-medium text-foreground mb-1">
            {language === "en" ? "Active filters:" : "Filtros ativos:"}
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedTechs.map((tech, index) => (
              <span key={tech}>
                {index > 0 && <span className="text-muted-foreground">, </span>}
                <span className="text-blue-600 dark:text-blue-400 font-medium">{tech}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 