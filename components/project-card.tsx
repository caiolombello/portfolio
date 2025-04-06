import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/data/projects"

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/portfolio/${project.id}`}
      className="group overflow-hidden rounded-lg border border-border/40 bg-card transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10 hover:-translate-y-1"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={project.imageUrl || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <span className="mb-2 inline-block rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
          {project.category}
        </span>

        <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:text-gold transition-colors duration-300">
          {project.title}
        </h3>

        <p className="text-sm text-muted-foreground">{project.shortDescription}</p>
      </div>
    </Link>
  )
}

