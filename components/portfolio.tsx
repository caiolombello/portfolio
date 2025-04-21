"use client";

import { useState, useEffect } from "react";
import ProjectCard from "./project-card";
import CategoryFilter from "./category-filter";
import type { Project } from "@/types";
import { useLanguage } from "@/contexts/language-context";

export default function Portfolio() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([
    language === "en" ? "All" : "Todos",
  ]);
  const [activeCategory, setActiveCategory] = useState(
    language === "en" ? "All" : "Todos",
  );
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/public/projects");
        const data = (await response.json()) as Project[];

        setProjects(data);

        // Extract unique categories and filter out undefined values
        const uniqueCategories = [
          language === "en" ? "All" : "Todos",
          ...new Set(
            data
              .map((project) => project.category)
              .filter((category): category is string => category !== undefined),
          ),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [language]);

  useEffect(() => {
    setIsAnimating(true);

    const timer = setTimeout(() => {
      setFilteredProjects(
        activeCategory === (language === "en" ? "All" : "Todos")
          ? projects
          : projects.filter((project) => project.category === activeCategory),
      );
      setIsAnimating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCategory, projects, language]);

  // Update active category when language changes
  useEffect(() => {
    if (activeCategory === "All" || activeCategory === "Todos") {
      setActiveCategory(language === "en" ? "All" : "Todos");
    }
  }, [language, activeCategory]);

  if (loading) {
    return (
      <div className="container py-12">
        <h1 className="mb-12 text-center text-4xl font-bold text-gold">
          {language === "en" ? "My Projects" : "Meus Projetos"}
        </h1>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-gold rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="mb-12 text-center text-4xl font-bold text-gold">
        {language === "en" ? "My Projects" : "Meus Projetos"}
      </h1>

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {filteredProjects.length === 0 ? (
        <div className="mt-12 text-center text-muted-foreground">
          {language === "en"
            ? "No projects found in this category."
            : "Nenhum projeto encontrado nesta categoria."}
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
