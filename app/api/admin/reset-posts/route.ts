import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getBlob } from "@/lib/blob-storage"

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
    // Tentar fazer backup do arquivo atual, mas não falhar se não conseguir
    try {
      const currentBlob = await getBlob("posts.json")
      if (currentBlob) {
        const backupName = `posts.json.backup-${Date.now()}`
        await put(backupName, currentBlob, {
          access: "public",
        })
        console.log(`Backup do arquivo atual salvo como ${backupName}`)
      }
    } catch (error) {
      console.error("Erro ao fazer backup:", error)
    }

    // Criar um novo arquivo com dados padrão
    const jsonString = JSON.stringify(defaultPosts, null, 2)
    await put("posts.json", jsonString, {
      access: "public",
    })

    console.log("Arquivo de posts resetado com dados padrão")

    return NextResponse.json({
      success: true,
      message: "Arquivo de posts resetado com sucesso",
    })
  } catch (error) {
    console.error("Erro ao resetar arquivo de posts:", error)
    return NextResponse.json(
      {
        error: "Erro ao resetar arquivo de posts",
      },
      { status: 500 },
    )
  }
}

