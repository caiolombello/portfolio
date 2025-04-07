import { loadFromBlob } from "./blob-storage"

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
    // Definir dados padrão para o perfil
    const defaultProfile = {
      name: "Caio Lombello",
      title: "DevOps Engineer",
      bio: "Desenvolvedor web apaixonado por criar experiências digitais incríveis.",
      email: "contato@exemplo.com",
      location: "Brasil",
      avatar: "/placeholder.svg?height=200&width=200",
      socialLinks: {
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        twitter: "https://twitter.com",
      },
      pt: {
        name: "Caio Lombello",
        about: "Desenvolvedor web apaixonado por criar experiências digitais incríveis.",
      },
      en: {
        name: "Caio Lombello",
        about: "Web developer passionate about creating amazing digital experiences.",
      },
    }

    // Carregar do Blob Storage ou sistema de arquivos local com fallback para dados padrão
    const profile = await loadFromBlob("profile.json", defaultProfile)
    return profile
  } catch (error) {
    console.error("Erro ao carregar profile:", error)
    return null
  }
}

