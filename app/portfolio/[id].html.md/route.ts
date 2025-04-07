import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

type RouteParams = Promise<{ id: string }>;

export async function GET(
  request: Request,
  props: { params: RouteParams }
) {
  try {
    const { id } = await props.params;

    // Carregar dados dos projetos
    const projectsPath = path.join(process.cwd(), "public", "data", "projects.json")
    const projectsData = JSON.parse(await fs.readFile(projectsPath, "utf-8"))

    // Encontrar o projeto específico
    const project = projectsData.find((p: any) => p.id === id)

    if (!project) {
      return new NextResponse("# Projeto não encontrado\n\nO projeto solicitado não existe ou foi removido.", {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
        },
      })
    }

    // Gerar markdown para o projeto
    const content = `# ${project.title}

**Categoria:** ${project.category}

${project.shortDescription}

## Detalhes do Projeto

${project.fullDescription || "Descrição detalhada do projeto."}

## Tecnologias Utilizadas

${project.technologies ? project.technologies.map((tech: string) => `- ${tech}`).join("\n") : "- N/A"}

## Links

- [Ver Demonstração](${project.demoUrl || "#"})
- [Repositório GitHub](${project.repoUrl || "#"})

## Screenshots

${
  project.screenshots
    ? project.screenshots
        .map(
          (screenshot: string, index: number) =>
            `### Screenshot ${index + 1}\n\n![Screenshot ${index + 1}](${screenshot})\n`,
        )
        .join("\n")
    : ""
}
`

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("Erro ao gerar markdown:", error)
    return new NextResponse("Erro ao gerar conteúdo markdown", { status: 500 })
  }
}

