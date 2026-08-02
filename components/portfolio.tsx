"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "./project-card";
import type { Project } from "@/types";
import { useLanguage } from "@/contexts/language-context";
import { Reveal } from "@/components/motion/reveal";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";

interface PortfolioProps {
  projects: Project[];
  limit?: number;
}

export default function Portfolio({ projects = [], limit }: PortfolioProps) {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const displayedProjects =
    limit && limit > 0 ? projects.slice(0, limit) : projects;

  return (
    <section
      id="portfolio"
      className="container border-b border-border/70 py-14 sm:py-24"
      aria-labelledby="portfolio-title"
    >
      <div>
        <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              {isEnglish ? "Selected work" : "Trabalhos selecionados"}
            </p>
            <h2
              id="portfolio-title"
              className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
            >
              {isEnglish
                ? "Systems, tools and platforms built to last."
                : "Sistemas, ferramentas e plataformas feitos para durar."}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              {isEnglish
                ? "A small selection of work across cloud infrastructure, developer experience and automation."
                : "Uma seleção de trabalhos em infraestrutura cloud, experiência de desenvolvimento e automação."}
            </p>
          </div>
          {limit && (
            <Link
              href={getLocalizedInstitutionalPath(
                "/portfolio",
                isEnglish ? "en" : "pt",
              )}
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-foreground"
            >
              {isEnglish ? "View all projects" : "Ver todos os projetos"}
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          )}
        </Reveal>

        {displayedProjects.length === 0 ? (
          <Reveal delay={0.08}>
            <div className="mt-10 rounded-xl border border-dashed border-border/80 p-8 text-center text-sm text-muted-foreground">
              {isEnglish
                ? "Projects will appear here soon."
                : "Novos projetos aparecerão aqui em breve."}
            </div>
          </Reveal>
        ) : (
          <Reveal
            className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2"
            delay={0.08}
          >
            {displayedProjects.map((project, index) => (
              <div
                key={project.id}
                className={
                  index === 0 && displayedProjects.length > 2
                    ? "md:row-span-2"
                    : undefined
                }
              >
                <ProjectCard project={project} featured={index === 0} />
              </div>
            ))}
          </Reveal>
        )}

        {limit && displayedProjects.length > 0 && (
          <div className="mt-10 sm:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link
                href={getLocalizedInstitutionalPath(
                  "/portfolio",
                  isEnglish ? "en" : "pt",
                )}
              >
                {isEnglish ? "View all projects" : "Ver todos os projetos"}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
