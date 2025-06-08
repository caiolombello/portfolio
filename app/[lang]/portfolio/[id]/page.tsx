import { notFound } from "next/navigation";
import { loadProjectById } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDictionary } from "@/app/i18n";
import { generatePageMetadata } from "@/lib/site-metadata";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id, lang } = await params;
  const project = await loadProjectById(id);
  const dict = await getDictionary(lang);

  if (!project) {
    return {
      title: `${dict.notFound.title} | Caio Barbieri`,
      description: dict.notFound.description,
    };
  }

  const title = lang === "pt" ? project.title_pt : project.title_en;
  const description =
    lang === "pt" ? project.shortDescription_pt : project.shortDescription_en;

  return generatePageMetadata(
    `${title} | ${dict.projects.title}`,
    description,
    project.imageUrl ?? undefined
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { lang, id } = await params;
  const project = await loadProjectById(id);
  const dict = await getDictionary(lang);

  if (!project) {
    notFound();
  }

  const title = lang === "pt" ? project.title_pt : project.title_en;
  const shortDescription =
    lang === "pt" ? project.shortDescription_pt : project.shortDescription_en;
  const description =
    lang === "pt" ? project.description_pt : project.description_en;

  return (
    <div className="container py-12">
      <Link
        href={`/${lang}/portfolio`}
        className="mb-8 inline-flex items-center text-muted-foreground hover:text-gold"
      >
        <ArrowLeft size={16} className="mr-2" />
        {dict.projects.backToPortfolio}
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-lg border border-border/40">
          <Image
            src={project.imageUrl ?? "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div>
          <span className="mb-2 inline-block rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
            {project.category}
          </span>

          <h1 className="mb-4 text-3xl font-bold text-gold">{title}</h1>

          <p className="mb-6 text-muted-foreground">{shortDescription}</p>

          <div className="rounded-lg border border-border/40 bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              {dict.projects.projectDetails}
            </h2>

            <p className="mb-4 text-muted-foreground">{description}</p>

            <h3 className="mb-2 text-lg font-medium text-foreground">
              {dict.projects.technologiesUsed}:
            </h3>

            <div className="mb-4 flex flex-wrap gap-2">
              {project.technologies?.map((tech) => (
                <span
                  key={tech.tech}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
                >
                  {tech.tech}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  className="inline-flex items-center text-gold hover:underline"
                >
                  {dict.projects.viewDemo}
                </Link>
              )}
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  className="inline-flex items-center text-gold hover:underline"
                >
                  {dict.projects.githubRepo}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
