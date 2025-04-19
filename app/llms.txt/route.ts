import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

interface Project {
  id: string;
  title: string;
  shortDescription: string;
}

interface Post {
  id: string;
  title: string;
  summary: string;
}

interface Skill {
  name: string;
}

// Função para gerar o conteúdo do llms.txt dinamicamente
async function generateLlmsTxt() {
  try {
    // Carregar dados necessários
    const profilePath = path.join(process.cwd(), "public", "data", "profile.json")
    const projectsPath = path.join(process.cwd(), "public", "data", "projects.json")
    const postsPath = path.join(process.cwd(), "public", "data", "posts.json")
    const skillsPath = path.join(process.cwd(), "public", "data", "skills.json")
    const certificationsPath = path.join(process.cwd(), "public", "data", "certifications.json")

    // Ler os arquivos
    const profileData = JSON.parse(await fs.readFile(profilePath, "utf-8"))
    const projectsData = JSON.parse(await fs.readFile(projectsPath, "utf-8")) as Project[]
    const postsData = JSON.parse(await fs.readFile(postsPath, "utf-8")) as Post[]
    const skillsData = JSON.parse(await fs.readFile(skillsPath, "utf-8")) as Skill[]
    const certificationsData = JSON.parse(await fs.readFile(certificationsPath, "utf-8"))

    // Obter o domínio base do site (para produção, você deve configurar isso)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://caio.lombello.com"

    // Gerar o conteúdo do llms.txt
    const content = `# Caio Lombello Vendramini Barbieri - Portfólio Profissional

> Site de portfólio profissional de ${profileData.pt.name}, um ${profileData.pt.title}. O site apresenta informações sobre experiência profissional, projetos, artigos técnicos e formas de contato.

Este site é construído com Next.js e Tailwind CSS, com tema escuro predominante e detalhes em amarelo/dourado. O site é totalmente responsivo e disponível em português e inglês.

## Perfil Profissional

- [Sobre Mim](${baseUrl}/index.html.md): ${profileData.pt.about}
- [Currículo](${baseUrl}/resume/index.html.md): Experiência profissional detalhada, formação acadêmica e certificações técnicas
- [Contato](${baseUrl}/contact/index.html.md): Informações de contato e formulário para mensagens

## Redes Sociais

- LinkedIn: https://linkedin.com/in/caiolvbarbieri
- GitHub: https://github.com/caiolombello
- Twitter: https://twitter.com/caiolombello
- Website: https://caio.lombello.com

## Projetos

- [Portfólio de Projetos](${baseUrl}/portfolio/index.html.md): Visão geral de todos os projetos desenvolvidos
${projectsData.map((project: Project) => `- [${project.title}](${baseUrl}/portfolio/${project.id}.html.md): ${project.shortDescription}`).join("\n")}

## Blog

- [Blog](${baseUrl}/blog/index.html.md): Artigos técnicos sobre DevOps, Cloud, Kubernetes e desenvolvimento de software
${postsData.map((post: Post) => `- [${post.title}](${baseUrl}/blog/${post.id}.html.md): ${post.summary}`).join("\n")}

## Tecnologias

- [Habilidades Técnicas](${baseUrl}/resume/index.html.md#skills): ${skillsData.map((skill: Skill) => skill.name).join(", ")}
- [Certificações](${baseUrl}/resume/index.html.md#certifications): ${certificationsData.join(", ")}

## Optional

- [Política de Privacidade](${baseUrl}/privacy-policy.html.md): Informações sobre como os dados dos usuários são tratados no site
- [Termos de Uso](${baseUrl}/terms-of-use.html.md): Termos e condições para uso do site`

    return content
  } catch (error) {
    console.error("Erro ao gerar llms.txt:", error)
    return `# Caio Lombello Vendramini Barbieri - Portfólio Profissional

> Ocorreu um erro ao gerar o conteúdo dinâmico. Por favor, tente novamente mais tarde.`
  }
}

export async function GET() {
  const content = await generateLlmsTxt()

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  })
}

