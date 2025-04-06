import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const projectsPath = path.join(process.cwd(), "public", "data", "projects.json")

export async function GET() {
  try {
    const fileContent = await fs.readFile(projectsPath, "utf-8")
    const projectsData = JSON.parse(fileContent)

    return NextResponse.json(projectsData)
  } catch (error) {
    console.error("Erro ao ler arquivo de projetos:", error)
    return NextResponse.json({ error: "Erro ao carregar dados de projetos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const projectsData = await request.json()

    // Validar dados (implementação básica)
    if (!Array.isArray(projectsData)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
    }

    // Salvar no arquivo
    await fs.writeFile(projectsPath, JSON.stringify(projectsData, null, 2), "utf-8")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar projetos:", error)
    return NextResponse.json({ error: "Erro ao salvar dados de projetos" }, { status: 500 })
  }
}

