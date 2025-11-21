"use client";

import { useState, useEffect, useMemo } from "react";
import ProjectCard from "./project-card";
import CategoryFilter from "./category-filter";
import type { Project } from "@/types";
import { useLanguage } from "@/contexts/language-context";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PortfolioProps {
  projects: Project[];
  limit?: number;
}

export default function Portfolio({ projects = [], limit }: PortfolioProps) {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<string[]>([
    language === "en" ? "All" : "Todos",
  ]);
  const [activeCategory, setActiveCategory] = useState(
    language === "en" ? "All" : "Todos",
  );
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Ensure projects is always an array
  const safeProjects = useMemo(
    () => (Array.isArray(projects) ? projects : []),
    [projects]
  );

  useEffect(() => {
    // Extract unique categories and filter out undefined values
    const uniqueCategories = [
      language === "en" ? "All" : "Todos",
      ...new Set(
        safeProjects
          .map((project) => project.category)
          .filter((category): category is string => category !== undefined),
      ),
    ];
    setCategories(uniqueCategories);
  }, [safeProjects, language]);

  useEffect(() => {
    setIsAnimating(true);

    const timer = setTimeout(() => {
      let result = activeCategory === (language === "en" ? "All" : "Todos")
        ? safeProjects
        : safeProjects.filter((project) => project.category === activeCategory);

      // Apply limit if provided
      if (limit && limit > 0) {
        result = result.slice(0, limit);
      }

      setFilteredProjects(result);
      setIsAnimating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCategory, safeProjects, language, limit]);

  // Update active category when language changes
  useEffect(() => {
    if (activeCategory === "All" || activeCategory === "Todos") {
      setActiveCategory(language === "en" ? "All" : "Todos");
    }
  }, [language, activeCategory]);

  return (
    <section id="portfolio" className="container py-12" suppressHydrationWarning>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold text-gold mb-4" suppressHydrationWarning>
            {language === "en" ? "My Projects" : "Meus Projetos"}
          </h1>
          {limit && (
            <p className="text-muted-foreground text-center max-w-2xl">
              {language === "en"
                ? "Here are some of my recent projects. View the full portfolio for more."
                : "Aqui estão alguns dos meus projetos recentes. Veja o portfólio completo para mais."}
            </p>
          )}
        </div>

        {!limit && (
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        )}

        {filteredProjects.length === 0 ? (
          <div className="mt-12 text-center text-muted-foreground" suppressHydrationWarning>
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

        {limit && (
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="group">
              <Link href="/portfolio">
                {language === "en" ? "View All Projects" : "Ver Todos os Projetos"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        )}
      </motion.div>
    </section>
  );
}
