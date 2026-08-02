"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/types";
import { useLanguage } from "@/contexts/language-context";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export default function ProjectCard({
  project,
  featured = false,
}: ProjectCardProps) {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const title = isEnglish ? project.title_en : project.title_pt;
  const shortDescription = isEnglish
    ? project.shortDescription_en
    : project.shortDescription_pt;

  return (
    <article
      className={`surface-motion group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/60 ${featured ? "md:min-h-[28rem]" : "md:min-h-[22rem]"}`}
    >
      <Link
        href={`/portfolio/${project.id}`}
        className="flex h-full flex-col"
        aria-label={`${isEnglish ? "Open project" : "Abrir projeto"}: ${title}`}
      >
        <div
          className={`relative overflow-hidden bg-secondary ${featured ? "aspect-[16/9] sm:aspect-[16/8]" : "aspect-[16/9]"}`}
        >
          <Image
            src={project.imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 66vw"
                : "(max-width: 768px) 100vw, 34vw"
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80" />
          {project.featured && (
            <span className="absolute left-4 top-4 rounded-full border border-gold/40 bg-background/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-gold backdrop-blur">
              {isEnglish ? "Featured" : "Destaque"}
            </span>
          )}
          <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-background/70 text-foreground opacity-100 backdrop-blur transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
                {project.category || (isEnglish ? "Project" : "Projeto")}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-foreground transition-colors group-hover:text-gold sm:text-2xl">
                {title}
              </h3>
            </div>
            <span
              className="mt-1 text-xs text-muted-foreground"
              aria-hidden="true"
            >
              ↗
            </span>
          </div>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {shortDescription}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
            {project.technologies?.slice(0, featured ? 5 : 3).map((tech) => (
              <span
                key={tech.tech}
                className="rounded-full border border-border/80 bg-secondary/60 px-2.5 py-1 text-[11px] text-muted-foreground"
              >
                {tech.tech}
              </span>
            ))}
            {project.githubUrl && (
              <span
                className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground"
                title="GitHub"
              >
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">GitHub</span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
