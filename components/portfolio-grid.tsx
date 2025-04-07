import { Project } from "@/types/project"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface PortfolioGridProps {
  projects: Project[]
}

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.shortDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {project.imageUrl && (
              <div className="relative aspect-video mb-4">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            {project.githubUrl && (
              <Button asChild variant="outline" size="sm">
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  GitHub
                </Link>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild variant="default" size="sm">
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Ver projeto
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 