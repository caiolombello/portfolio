import { NextResponse } from "next/server"
import { saveToBlob, loadFromBlob } from "@/lib/blob-storage"
import { defaultMetadata, type SiteMetadata } from "@/types/metadata"

// Modificar a função GET para lidar melhor com erros

export async function GET() {
  try {
    // Carregar do sistema de armazenamento (Blob Storage ou arquivo local)
    const metadataData = await loadFromBlob<SiteMetadata>("metadata", defaultMetadata)
    return NextResponse.json(metadataData)
  } catch (error) {
    console.error("Erro ao carregar metadados:", error)
    // Em caso de erro, retornar os metadados padrão
    return NextResponse.json(defaultMetadata)
  }
}

export async function POST(request: Request) {
  try {
    const metadataData = await request.json()

    // Validar dados (implementação básica)
    if (!metadataData.title || !metadataData.description) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    // Salvar no sistema de armazenamento (Blob Storage ou arquivo local)
    const result = await saveToBlob("metadata", metadataData)

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "Erro ao salvar os metadados",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar metadados:", error)
    return NextResponse.json(
      {
        error: "Erro ao salvar metadados",
      },
      { status: 500 },
    )
  }
}

