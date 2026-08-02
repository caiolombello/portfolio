import type { Project } from "@/types";
import ProjectCard from "@/components/project-card";

interface PortfolioGridProps {
  projects: Project[];
}

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} featured={index === 0 && Boolean(project.featured)} />
      ))}
    </div>
  );
}
