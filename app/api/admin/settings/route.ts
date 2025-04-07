import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getBlob } from "@/lib/blob-storage"

const defaultSettings = {
  siteName: "Caio Lombello",
  baseUrl: "https://caio.lombello.com",
  contactEmail: "contato@caio.lombello.com",
  socialLinks: {
    github: "https://github.com/caiolombello",
    linkedin: "https://linkedin.com/in/caiolombello",
    twitter: "https://twitter.com/caiolombello",
  },
}

export async function GET() {
  try {
    const settings = await getBlob("settings.json")
    if (!settings) {
      // Create default settings if they don't exist
      await put("settings.json", JSON.stringify(defaultSettings), {
        access: "public",
      })
      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(JSON.parse(settings))
  } catch (error) {
    console.error("Erro ao carregar configurações:", error)
    return NextResponse.json(
      { error: "Erro ao carregar configurações" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json()

    // Validate settings
    if (!settings.siteName || !settings.baseUrl || !settings.contactEmail) {
      return NextResponse.json(
        { error: "Configurações inválidas" },
        { status: 400 }
      )
    }

    // Save settings
    await put("settings.json", JSON.stringify(settings), {
      access: "public",
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Erro ao salvar configurações:", error)
    return NextResponse.json(
      { error: "Erro ao salvar configurações" },
      { status: 500 }
    )
  }
} 