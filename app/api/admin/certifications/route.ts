import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const certificationsPath = path.join(process.cwd(), "public", "data", "certifications.json")

export async function GET() {
  try {
    const fileContent = await fs.readFile(certificationsPath, "utf-8")
    const certificationsData = JSON.parse(fileContent)

    return NextResponse.json(certificationsData)
  } catch (error) {
    console.error("Erro ao ler arquivo de certificações:", error)
    return NextResponse.json({ error: "Erro ao carregar dados de certificações" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const certificationsData = await request.json()

    // Validar dados (implementação básica)
    if (!Array.isArray(certificationsData)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    // Salvar no arquivo
    await fs.writeFile(certificationsPath, JSON.stringify(certificationsData, null, 2), "utf-8")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar certificações:", error)
    return NextResponse.json({ error: "Erro ao salvar dados de certificações" }, { status: 500 })
  }
}

