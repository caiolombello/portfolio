"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Code2, Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Project } from "@/types";

interface TechFilterProps {
  projects: Project[];
  onFilteredProjectsChange: (filteredProjects: Project[]) => void;
}

export function TechFilter({ projects, onFilteredProjectsChange }: TechFilterProps) {
  const { language } = useLanguage();
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const callbackRef = useRef(onFilteredProjectsChange);
  callbackRef.current = onFilteredProjectsChange;

  const allTechs = useMemo(
    () => Array.from(new Set(projects.flatMap((project) => project.technologies?.map((tech) => tech.tech) || []))).sort(),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesTech = selectedTechs.length === 0 || selectedTechs.some((tech) => project.technologies?.some((projectTech) => projectTech.tech === tech));
      if (!matchesTech) return false;
      if (!query) return true;
      const title = language === "en" ? project.title_en : project.title_pt;
      const description = language === "en" ? project.shortDescription_en : project.shortDescription_pt;
      return `${title} ${description}`.toLowerCase().includes(query);
    });
  }, [language, projects, searchQuery, selectedTechs]);

  useEffect(() => {
    callbackRef.current(filteredProjects);
  }, [filteredProjects]);

  if (allTechs.length === 0 || projects.length < 3) return null;

  const clearFilters = () => {
    setSelectedTechs([]);
    setSearchQuery("");
  };

  const hasFilters = selectedTechs.length > 0 || searchQuery.trim().length > 0;

  return (
    <div className="mb-8 rounded-2xl border border-border/70 bg-card/40 p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={language === "en" ? "Search projects" : "Buscar projetos"}
            aria-label={language === "en" ? "Search projects" : "Buscar projetos"}
            className="h-11 border-border/80 bg-background/50 pl-10"
          />
        </div>
        {hasFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="self-start text-muted-foreground hover:text-foreground lg:self-auto">
            <X className="h-4 w-4" aria-hidden="true" />
            {language === "en" ? "Clear filters" : "Limpar filtros"}
          </Button>
        )}
      </div>

      <fieldset className="mt-5">
        <legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <Code2 className="h-4 w-4 text-gold" aria-hidden="true" />
          {language === "en" ? "Filter by technology" : "Filtrar por tecnologia"}
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {allTechs.map((tech) => {
            const selected = selectedTechs.includes(tech);
            return (
              <button
                key={tech}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedTechs((current) => selected ? current.filter((item) => item !== tech) : [...current, tech])}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${selected ? "border-gold bg-gold text-slate-950" : "border-border/80 bg-secondary/60 text-muted-foreground hover:border-gold/50 hover:text-foreground"}`}
              >
                {tech}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
