import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getBlob } from "@/lib/blob-storage"

const defaultPosts = [
  {
    id: "welcome",
    title: "Bem-vindo ao meu blog",
    slug: "bem-vindo-ao-meu-blog",
    description: "Primeiro post do blog, apresentando o conteúdo e objetivos.",
    content: `# Bem-vindo ao meu blog

Este é o primeiro post do meu blog. Aqui vou compartilhar meus conhecimentos e experiências sobre DevOps, Cloud Computing e Engenharia de Software.

## Sobre mim

Sou Caio Lombello, DevOps & Cloud Engineer com experiência em automação, infraestrutura como código e desenvolvimento de software.

## Objetivos do blog

- Compartilhar conhecimento
- Documentar aprendizados
- Conectar com a comunidade
- Contribuir com o ecossistema

## Próximos posts

Fique ligado para mais conteúdo sobre:

- Kubernetes
- Docker
- AWS
- CI/CD
- Infraestrutura como Código
- Automação
- Desenvolvimento de Software

Obrigado por visitar!`,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["introdução", "devops", "cloud"],
  },
]

export async function GET() {
  try {
    const posts = await getBlob("posts.json")
    if (!posts) {
      // Create default posts if they don't exist
      await put("posts.json", JSON.stringify(defaultPosts), {
        access: "public",
      })
      return NextResponse.json(defaultPosts)
    }

    return NextResponse.json(JSON.parse(posts))
  } catch (error) {
    console.error("Erro ao carregar posts:", error)
    return NextResponse.json(
      { error: "Erro ao carregar posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const post = await request.json()

    // Validate post
    if (!post.title || !post.slug || !post.content) {
      return NextResponse.json(
        { error: "Post inválido" },
        { status: 400 }
      )
    }

    // Load current posts
    const posts = await getBlob("posts.json")
    let postsData = []
    if (posts) {
      postsData = JSON.parse(posts)
    }

    // Add new post
    postsData.push({
      ...post,
      id: post.id || crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // Save posts
    await put("posts.json", JSON.stringify(postsData), {
      access: "public",
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Erro ao criar post:", error)
    return NextResponse.json(
      { error: "Erro ao criar post" },
      { status: 500 }
    )
  }
}

