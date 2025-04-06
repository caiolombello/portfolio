import { NextResponse } from "next/server"
import { getBlob } from "@/lib/blob-storage"

export async function GET() {
  try {
    // Verificar se o arquivo existe
    const currentBlob = await getBlob("posts.json")
    if (!currentBlob) {
      // Se o arquivo não existir, retornar array vazio
      return NextResponse.json([])
    }

    // Tentar ler o arquivo
    const fileContent = await currentBlob.text()
    const postsData = JSON.parse(fileContent)

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

