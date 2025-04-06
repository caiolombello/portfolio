import type { Metadata } from "next"
import { getProfile } from "@/lib/profile"

// Função para gerar metadados dinâmicos
export async function getSiteMetadata(): Promise<Metadata> {
  // Carregar o perfil para obter informações dinâmicas
  const profile = await getProfile()

  // Definir metadados padrão
  const title = profile?.pt?.name || "Portfolio"
  const description = profile?.pt?.about || "Meu portfolio profissional"

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: description,
    keywords: ["portfolio", "desenvolvedor", "programador", "web", "fullstack"],
    authors: [{ name: profile?.pt?.name || "Desenvolvedor" }],
    creator: profile?.pt?.name || "Desenvolvedor",
    publisher: profile?.pt?.name || "Desenvolvedor",
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: process.env.NEXT_PUBLIC_BASE_URL || "https://portfolio.vercel.app",
      title: title,
      description: description,
      siteName: title,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },
    themeColor: "#121212",
    colorScheme: "dark",
  }
}

