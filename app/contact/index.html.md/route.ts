import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    // Carregar dados do perfil
    const profilePath = path.join(process.cwd(), "public", "data", "profile.json")
    const profileData = JSON.parse(await fs.readFile(profilePath, "utf-8"))

    // Usar os dados em português por padrão
    const profile = profileData.pt

    // Gerar markdown para a página de contato
    const content = `# Contato

## ${profile.name}

${profile.title}

### Informações de Contato

- **Email:** ${profile.email}
- **Telefone:** ${profile.phone}
- **Localização:** ${profile.location}
- **Data de Nascimento:** ${profile.birthDate}

### Redes Sociais

- LinkedIn: https://linkedin.com/in/caiolvbarbieri
- GitHub: https://github.com/caiolombello
- Twitter: https://twitter.com/caiolombello
- Instagram: https://instagram.com/caiolombello
- Website: https://caio.lombello.com

### Agendar Reunião

Você pode agendar uma reunião através do link: https://fantastical.app/caiolvbarbieri

### Enviar Mensagem

Para enviar uma mensagem, por favor visite a [página de contato](https://caio.lombello.com/contact) e preencha o formulário.
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

