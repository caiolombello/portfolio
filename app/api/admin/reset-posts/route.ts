import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const postsPath = path.join(process.cwd(), "public", "data", "posts.json")

// Dados padrão para usar em caso de erro na leitura do arquivo
const defaultPosts = [
  {
    id: "kubernetes-hpa-custom-metrics",
    title: "Kubernetes HPA: Custom Metrics for Autoscaling",
    category: "Kubernetes",
    publicationDate: "2023-03-16",
    imageUrl: "/placeholder.svg?height=300&width=600",
    summary: "Unlock the Full Potential of Kubernetes Horizontal Pod Autoscaler with Custom Metrics.",
    content: "# Kubernetes HPA: Custom Metrics for Autoscaling\n\nThis is a placeholder content.",
  },
  {
    id: "acelerando-transformacao-digital",
    title: "Acelerando A Transformação Digital com DevOps",
    category: "DevOps",
    publicationDate: "2023-04-16",
    imageUrl: "/placeholder.svg?height=300&width=600",
    summary: "Uma abordagem prática para implementar a cultura DevOps e acelerar a transformação digital.",
    content: "# Acelerando A Transformação Digital com DevOps\n\nEste é um conteúdo placeholder.",
  },
]

export async function GET() {
  try {
    let posts = defaultPosts
    try {
      const file = await fs.readFile(postsPath, "utf-8")
      posts = JSON.parse(file)
    } catch {}
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Erro ao carregar posts:", error)
    return NextResponse.json(defaultPosts)
  }
}

export async function POST(request: Request) {
  try {
    const postsData = await request.json()
    await fs.writeFile(postsPath, JSON.stringify(postsData, null, 2), "utf-8")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar posts:", error)
    return NextResponse.json({ error: "Erro ao salvar posts" }, { status: 500 })
  }
}

