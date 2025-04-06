import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    // Carregar dados do perfil
    const profilePath = path.join(process.cwd(), "public", "data", "profile.json")
    const skillsPath = path.join(process.cwd(), "public", "data", "skills.json")

    const profileData = JSON.parse(await fs.readFile(profilePath, "utf-8"))
    const skillsData = JSON.parse(await fs.readFile(skillsPath, "utf-8"))

    // Gerar markdown para a página inicial
    const content = `# ${profileData.pt.name}

## ${profileData.pt.title}

${profileData.pt.about}

### Contato

- Email: ${profileData.pt.email}
- Telefone: ${profileData.pt.phone}
- Localização: ${profileData.pt.location}

### Habilidades Principais

${skillsData.map((skill) => `- ${skill.name}: ${skill.percentage}%`).join("\n")}
`

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("Erro ao gerar markdown:", error)
    return new NextResponse("Erro ao gerar conteúdo markdown", { status: 500 })
  }
}

