"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types";
import { useLanguage } from "@/contexts/language-context";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { language } = useLanguage();
  const title = language === "pt" ? project.title_pt : project.title_en;
  const shortDescription =
    language === "pt"
      ? project.shortDescription_pt
      : project.shortDescription_en;

  return (
    <Link
      href={`/portfolio/${project.id}`}
      className="group overflow-hidden rounded-lg border border-border/40 bg-card transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10 hover:-translate-y-1"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={project.imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <span className="mb-2 inline-block rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
          {project.category}
        </span>

        <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-gold transition-colors duration-300">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground">{shortDescription}</p>
      </div>
    </Link>
  );
}
