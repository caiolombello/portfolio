import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import type { ProjectView } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./project-cover";
import { TechIcon } from "./tech-icon";

export function StatusBadge({
  project,
  className,
}: {
  project: ProjectView;
  className?: string;
}) {
  if (!project.statusLabel) return null;
  const dot =
    project.status === "alpha"
      ? "bg-amber-400"
      : project.status === "private"
        ? "bg-zinc-400"
        : "bg-emerald-400";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/90 backdrop-blur-md",
        className,
      )}
    >
      {project.status === "private" ? (
        <Lock className="h-3 w-3" aria-hidden="true" />
      ) : (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", dot)}
          aria-hidden="true"
        />
      )}
      {project.statusLabel}
    </span>
  );
}

export function TechList({
  technologies,
  max,
  className,
}: {
  technologies: string[];
  max?: number;
  className?: string;
}) {
  const visible =
    typeof max === "number" ? technologies.slice(0, max) : technologies;
  const hidden = technologies.length - visible.length;

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map((technology) => (
        <li
          key={technology}
          className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/50 px-2.5 py-1 text-xs text-muted-foreground"
        >
          <TechIcon name={technology} className="h-3 w-3 opacity-70" />
          {technology}
        </li>
      ))}
      {hidden > 0 && (
        <li className="inline-flex items-center rounded-full border border-dashed border-border px-2.5 py-1 font-mono text-xs text-muted-foreground">
          +{hidden}
        </li>
      )}
    </ul>
  );
}

interface ProjectCardProps {
  project: ProjectView;
  size?: "default" | "large";
  headingLevel?: "h2" | "h3";
  className?: string;
}

export function ProjectCard({
  project,
  size = "default",
  headingLevel = "h3",
  className,
}: ProjectCardProps) {
  const Heading = headingLevel;
  const large = size === "large";

  return (
    <Link
      href={project.href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_24px_60px_-32px_rgba(0,0,0,0.55)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        large && "md:flex-row",
        className,
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] shrink-0 overflow-hidden border-b",
          large &&
            "md:aspect-auto md:min-h-[340px] md:w-[55%] md:border-b-0 md:border-r lg:min-h-[400px] lg:w-[58%]",
        )}
      >
        <ProjectCover
          id={project.id}
          title={project.title}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />
        <StatusBadge project={project} className="absolute left-3 top-3" />
      </div>

      <div
        className={cn("flex flex-1 flex-col p-5 sm:p-6", large && "lg:p-10")}
      >
        <p className="eyebrow">
          {project.categoryLabel}
          {project.year ? ` · ${project.year}` : ""}
        </p>
        <Heading
          className={cn(
            "mt-3 flex items-start justify-between gap-3 font-semibold tracking-tight",
            large ? "text-2xl lg:text-3xl" : "text-xl",
          )}
        >
          {project.title}
          <ArrowUpRight
            className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
            aria-hidden="true"
          />
        </Heading>
        {project.tagline && (
          <p
            className={cn(
              "mt-1.5 font-serif italic leading-snug text-brand",
              large ? "text-xl" : "text-lg",
            )}
          >
            {project.tagline}
          </p>
        )}
        <p
          className={cn(
            "mt-3 text-sm leading-relaxed text-muted-foreground",
            !large && "line-clamp-3",
          )}
        >
          {project.summary}
        </p>
        <TechList
          technologies={project.technologies}
          max={large ? 6 : 4}
          className="mt-auto pt-6"
        />
      </div>
    </Link>
  );
}
