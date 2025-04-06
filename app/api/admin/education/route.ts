import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const educationPath = path.join(process.cwd(), "public", "data", "education.json")

export async function GET() {
  try {
    const fileContent = await fs.readFile(educationPath, "utf-8")
    const educationData = JSON.parse(fileContent)

    return NextResponse.json(educationData)
  } catch (error) {
    console.error("Erro ao ler arquivo de educação:", error)
    return NextResponse.json({ error: "Erro ao carregar dados de educação" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const educationData = await request.json()

    // Validar dados (implementação básica)
    if (!educationData.pt || !educationData.en) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    // Salvar no arquivo
    await fs.writeFile(educationPath, JSON.stringify(educationData, null, 2), "utf-8")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar educação:", error)
    return NextResponse.json({ error: "Erro ao salvar dados de educação" }, { status: 500 })
  }
}

