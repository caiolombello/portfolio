import { NextResponse } from "next/server"
import { getBlob } from "@/lib/blob-storage"

export async function GET() {
  try {
    // Verificar se o arquivo existe
    const currentBlob = await getBlob("posts.json")
    if (!currentBlob) {
      return NextResponse.json(
        { success: false, error: "Arquivo não encontrado" },
        { status: 404 }
      )
    }

    // Tentar ler o arquivo
    const postsData = JSON.parse(currentBlob)

    // Verificar se postsData é um array
    if (!Array.isArray(postsData)) {
      return NextResponse.json([])
    }

    return NextResponse.json(postsData)
  } catch (error) {
    console.error("Erro ao ler arquivo de posts:", error)
    // Em caso de erro, retornar array vazio
    return NextResponse.json([])
  }
}

