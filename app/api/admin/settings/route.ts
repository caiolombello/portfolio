import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const settingsPath = path.join(process.cwd(), "public", "data", "settings.json")

const defaultSettings = {
  siteName: "Caio Lombello Vendramini Barbieri",
  baseUrl: "https://caio.lombello.com",
  contactEmail: "caio@lombello.com",
  socialLinks: {
    github: "https://github.com/caiolombello",
    linkedin: "https://linkedin.com/in/caiolvbarbieri",
    twitter: "https://twitter.com/caiolombello",
  },
}

export async function GET() {
  try {
    let settings = defaultSettings
    try {
      const file = await fs.readFile(settingsPath, "utf-8")
      settings = JSON.parse(file)
    } catch {}
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Erro ao carregar configurações:", error)
    return NextResponse.json({ error: "Erro ao carregar configurações" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const settingsData = await request.json()
    await fs.writeFile(settingsPath, JSON.stringify(settingsData, null, 2), "utf-8")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar configurações:", error)
    return NextResponse.json({ error: "Erro ao salvar configurações" }, { status: 500 })
  }
} 