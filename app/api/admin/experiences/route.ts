import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const experiencesPath = path.join(process.cwd(), "public", "data", "experiences.json")

export async function GET() {
  try {
    const fileContent = await fs.readFile(experiencesPath, "utf-8")
    const experiencesData = JSON.parse(fileContent)

    return NextResponse.json(experiencesData)
  } catch (error) {
    console.error("Erro ao ler arquivo de experiências:", error)
    return NextResponse.json({ error: "Erro ao carregar dados de experiências" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const experiencesData = await request.json()

    // Validar dados (implementação básica)
    if (!experiencesData.pt || !experiencesData.en) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    // Salvar no arquivo
    await fs.writeFile(experiencesPath, JSON.stringify(experiencesData, null, 2), "utf-8")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar experiências:", error)
    return NextResponse.json({ error: "Erro ao salvar dados de experiências" }, { status: 500 })
  }
}

