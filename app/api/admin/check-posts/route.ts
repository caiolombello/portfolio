import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const postsPath = path.join(process.cwd(), "public", "data", "posts.json")

export async function GET() {
  try {
    // Verificar se o arquivo existe
    try {
      await fs.access(postsPath)
    } catch (accessError) {
      // Se o arquivo não existir, retornar status ok (não está corrompido, apenas não existe)
      return NextResponse.json({ status: "ok", exists: false })
    }

    // Tentar ler o arquivo sem fazer parse
    try {
      const fileContent = await fs.readFile(postsPath, "utf-8")

      // Tentar fazer o parse do JSON apenas para verificar se está corrompido
      try {
        JSON.parse(fileContent)
        return NextResponse.json({ status: "ok", exists: true })
      } catch (parseError) {
        // Se não conseguir fazer o parse, retornar status corrupted
        return NextResponse.json({
          status: "corrupted",
          error: parseError instanceof Error ? parseError.message : "Erro desconhecido",
        })
      }
    } catch (readError) {
      // Se não conseguir ler o arquivo, retornar status corrupted
      return NextResponse.json({
        status: "corrupted",
        error: readError instanceof Error ? readError.message : "Erro ao ler o arquivo",
      })
    }
  } catch (error) {
    // Erro geral
    return NextResponse.json({
      status: "error",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })
  }
}

