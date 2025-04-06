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

