import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { generatePageMetadata } from "@/components/seo/page-seo"
import type { Metadata } from "next"
import { Project } from "@/types/project"
import { getProjectById } from "@/lib/data"

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id)

  if (!project) {
    return {
      title: "Projeto não encontrado | Caio Lombello",
      description: "O projeto solicitado não foi encontrado",
    }
  }

  return generatePageMetadata({
    title: `${project.title ?? ""} | Portfólio`,
    description: project.shortDescription ?? "",
    path: `/portfolio/${project.id}`,
    ogImage: project.imageUrl ?? "",
    type: "article",
    tags: [project.category, "portfolio", "projeto"],
  })
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProjectById(id)

  if (!project) {
    notFound()
  }

  return (
    <div className="container py-12">
      <Link href="/portfolio" className="mb-8 inline-flex items-center text-muted-foreground hover:text-gold">
        <ArrowLeft size={16} className="mr-2" />
        Voltar para o portfólio
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-lg border border-border/40">
          <Image
            src={project.imageUrl ?? "/placeholder.svg"}
            alt={project.title ?? ""}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div>
          <span className="mb-2 inline-block rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
            {project.category}
          </span>

          <h1 className="mb-4 text-3xl font-bold text-gold">{project.title}</h1>

          <p className="mb-6 text-muted-foreground">{project.shortDescription}</p>

          <div className="rounded-lg border border-border/40 bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Detalhes do Projeto</h2>

            <p className="mb-4 text-muted-foreground">
              {project.description}
            </p>

            <h3 className="mb-2 text-lg font-medium text-foreground">Tecnologias Utilizadas:</h3>

            <div className="mb-4 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              {project.liveUrl && (
                <Link href={project.liveUrl} className="inline-flex items-center text-gold hover:underline">
                  Ver Demonstração
                </Link>
              )}
              {project.githubUrl && (
                <Link href={project.githubUrl} className="inline-flex items-center text-gold hover:underline">
                  Repositório GitHub
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

