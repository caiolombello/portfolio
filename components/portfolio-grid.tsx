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
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";

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
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{shortDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {project.imageUrl && (
                <div className="relative aspect-video mb-4">
                  <Image
                    src={project.imageUrl}
                    alt={title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech) => (
                  <span
                    key={tech.tech}
                    className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                  >
                    {tech.tech}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              {project.githubUrl && (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </Link>
                </Button>
              )}
              {project.liveUrl && (
                <Button asChild variant="default" size="sm">
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
