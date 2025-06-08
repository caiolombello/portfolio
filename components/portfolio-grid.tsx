import type { Project } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectImage } from "@/components/portfolio/project-image";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { ExternalLink, Github } from "lucide-react";

interface PortfolioGridProps {
  projects: Project[];
}

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const title = language === "pt" ? project.title_pt : project.title_en;
        const shortDescription =
          language === "pt"
            ? project.shortDescription_pt
            : project.shortDescription_en;

        return (
          <Card key={project.id} className={`flex flex-col transition-all duration-300 hover:shadow-lg ${project.featured ? 'ring-2 ring-yellow-400/50' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {title}
                    {project.featured && (
                      <span className="text-yellow-500 text-sm">⭐</span>
                    )}
                  </CardTitle>
                  <CardDescription>{shortDescription}</CardDescription>
                </div>
                {project.category && (
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full shrink-0">
                    {project.category}
                  </span>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow space-y-4">
              <div className="relative aspect-video">
                <ProjectImage
                  src={project.imageUrl}
                  alt={title}
                  fill
                  className="object-cover rounded-md"
                  size="small"
                />
              </div>
              
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech.tech}
                      className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                    >
                      {tech.tech}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex gap-2">
              {project.githubUrl && (
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-1" />
                    GitHub
                  </Link>
                </Button>
              )}
              {project.liveUrl && (
                <Button asChild variant="default" size="sm" className="flex-1">
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    {language === "pt" ? "Ver projeto" : "View project"}
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
