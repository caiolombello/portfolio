"use client";

import { useMemo } from "react";
import { PreviewWrapper } from "./preview-wrapper";
import { OptimizedImage } from "../ui/optimized-image";
import { Badge } from "../ui/badge";
import { CmsEntry } from "../../types/cms";

interface ProjectPreviewProps {
  entry: CmsEntry<{
    title: string;
    description: string;
    image: string;
    technologies: string[];
    url: string;
    github: string;
    featured: boolean;
  }>;
}

export function ProjectPreview({ entry }: ProjectPreviewProps) {
  const title = (entry.getIn(["data", "title"]) || "").toString();
  const description = (entry.getIn(["data", "description"]) || "").toString();
  const image = (entry.getIn(["data", "image"]) || "").toString();
  const url = (entry.getIn(["data", "url"]) || "").toString();
  const github = (entry.getIn(["data", "github"]) || "").toString();
  const featured = Boolean(entry.getIn(["data", "featured"]));
  const locale = (entry.getIn(["data", "locale"]) || "en").toString();

  const techList = useMemo(() => {
    const techs = entry.getIn(["data", "technologies"]) || [];
    return Array.isArray(techs) ? techs.map(tech => tech.toString()) : [];
  }, [entry]);

  return (
    <PreviewWrapper locale={locale}>
      <article
        className={`rounded-lg border bg-card p-6 ${featured ? "ring-2 ring-primary" : ""}`}
      >
        {image && (
          <div className="aspect-video overflow-hidden rounded-lg mb-6">
            <OptimizedImage
              src={image}
              alt={title}
              width={1200}
              height={630}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">
            {title}
            {featured && (
              <Badge variant="secondary" className="ml-2">
                Featured
              </Badge>
            )}
          </h2>

          <p className="text-muted-foreground">{description}</p>

          {techList.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techList.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                Live Demo →
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                GitHub →
              </a>
            )}
          </div>
        </div>
      </article>
    </PreviewWrapper>
  );
}
