import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { defaultMetadata, type SiteMetadata } from "@/types/metadata"

const metadataPath = path.join(process.cwd(), "public", "data", "metadata.json")

// Modificar a função GET para lidar melhor com erros

export async function GET() {
  try {
    let metadataData = defaultMetadata
    try {
      const file = await fs.readFile(metadataPath, "utf-8")
      metadataData = JSON.parse(file)
    } catch {}
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
    await fs.writeFile(metadataPath, JSON.stringify(metadataData, null, 2), "utf-8")

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

