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

    // Carregar dados dos posts
    const postsPath = path.join(process.cwd(), "public", "data", "posts.json")
    const postsData = JSON.parse(await fs.readFile(postsPath, "utf-8"))

    // Encontrar o post específico
    const post = postsData.find((p: any) => p.id === id)

    if (!post) {
      return new NextResponse("# Post não encontrado\n\nO artigo solicitado não existe ou foi removido.", {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
        },
      })
    }

    // Formatar a data
    const date = new Date(post.publicationDate)
    const formattedDate = date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Gerar markdown para o post
    // Se o post já tem conteúdo em markdown, usamos ele diretamente
    const content = post.content
      ? post.content
      : `# ${post.title}

**Categoria:** ${post.category} | **Data:** ${formattedDate}

${post.summary}

## Conteúdo

Este é um placeholder para o conteúdo completo do artigo. Em um blog real, aqui seria exibido o texto completo do post, formatado com Markdown.

### Introdução

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.

### Desenvolvimento

Suspendisse potenti. Sed euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.

\`\`\`
# Exemplo de código
function example() {
console.log("Hello, world!");
}
\`\`\`

### Conclusão

Cras mattis consectetur purus sit amet fermentum. Nullam quis risus eget urna mollis ornare vel eu leo.
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

