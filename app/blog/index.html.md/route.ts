import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    // Carregar dados dos posts
    const postsPath = path.join(process.cwd(), "public", "data", "posts.json")
    const postsData = JSON.parse(await fs.readFile(postsPath, "utf-8"))

    // Ordenar posts por data (mais recentes primeiro)
    const sortedPosts = [...postsData].sort(
      (a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime(),
    )

    // Gerar markdown para a página de blog
    let content = `# Blog

Artigos sobre DevOps, Cloud, Kubernetes e desenvolvimento de software.

`

    // Adicionar posts
    sortedPosts.forEach((post) => {
      // Formatar a data
      const date = new Date(post.publicationDate)
      const formattedDate = date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      content += `## [${post.title}](${post.id}.html.md)\n\n`
      content += `**Categoria:** ${post.category} | **Data:** ${formattedDate}\n\n`
      content += `${post.summary}\n\n`
      content += `[Ler mais](${post.id}.html.md)\n\n`
      content += `---\n\n`
    })

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

