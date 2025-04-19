import { notFound } from "next/navigation"
import { getProjectById } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ProjectPage({ params }: { params: { lang: string; id: string } }) {
  const { lang, id } = params
  const project = getProjectById(id)

  if (!project) {
    notFound()
  }

  return (
    <div className="container py-12">
      <Link href={`/${lang}/portfolio`} className="mb-8 inline-flex items-center text-muted-foreground hover:text-gold">
        <ArrowLeft size={16} className="mr-2" />
        {lang === "en" ? "Back to portfolio" : "Voltar para o portfólio"}
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-lg border border-border/40">
          <Image
            src={project.imageUrl || "/placeholder.svg"}
            alt={lang === "en" ? project.title_en : project.title_pt}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div>
          <span className="mb-2 inline-block rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
            {project.category}
          </span>

          <h1 className="mb-4 text-3xl font-bold text-gold">{lang === "en" ? project.title_en : project.title_pt}</h1>

          <p className="mb-6 text-muted-foreground">{lang === "en" ? project.shortDescription_en : project.shortDescription_pt}</p>

          <div className="rounded-lg border border-border/40 bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold text-foreground">{lang === "en" ? "Project Details" : "Detalhes do Projeto"}</h2>

            <p className="mb-4 text-muted-foreground">
              {lang === "en" ? project.description_en : project.description_pt}
            </p>

            <h3 className="mb-2 text-lg font-medium text-foreground">{lang === "en" ? "Technologies Used" : "Tecnologias Utilizadas"}:</h3>

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
                  {lang === "en" ? "View Demo" : "Ver Demonstração"}
                </Link>
              )}
              {project.githubUrl && (
                <Link href={project.githubUrl} className="inline-flex items-center text-gold hover:underline">
                  GitHub
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 