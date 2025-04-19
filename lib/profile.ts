import fs from "fs/promises"
import path from "path"

export interface Profile {
  name: string
  title: string
  bio: string
  email: string
  location: string
  avatar: string
  socialLinks: {
    linkedin?: string
    github?: string
    twitter?: string
    instagram?: string
    website?: string
  }
  pt?: {
    name: string
    about: string
  }
  en?: {
    name: string
    about: string
  }
}

export async function getProfile(): Promise<Profile | null> {
  try {
    const defaultProfile = {
      name: "Caio Lombello Vendramini Barbieri",
      title: "DevOps Engineer",
      bio: "Desenvolvedor web apaixonado por criar experiências digitais incríveis.",
      email: "caio@lombello.com",
      location: "Brasil",
      avatar: "/placeholder.svg?height=200&width=200",
      socialLinks: {
        linkedin: "https://linkedin.com/in/caiolvbarbieri",
        github: "https://github.com/caiolombello",
        twitter: "https://twitter.com/caiolombello",
        website: "https://caio.lombello.com",
      },
      pt: {
        name: "Caio Lombello Vendramini Barbieri",
        about: "Desenvolvedor web apaixonado por criar experiências digitais incríveis.",
      },
      en: {
        name: "Caio Lombello Vendramini Barbieri",
        about: "Web developer passionate about creating amazing digital experiences.",
      },
    }
    const filePath = path.join(process.cwd(), "public/data/profile.json")
    let profile = defaultProfile
    try {
      const file = await fs.readFile(filePath, "utf-8")
      profile = JSON.parse(file)
    } catch {}
    return profile
  } catch (error) {
    console.error("Erro ao carregar profile:", error)
    return null
  }
}

