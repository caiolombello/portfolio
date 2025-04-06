import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

// Função para limpar caracteres de controle de uma string
function cleanJsonString(str: string): string {
  return (
    str
      // Remove caracteres de controle
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
      // Escapa aspas dentro de strings
      .replace(/\\(?!["\\/bfnrt])/g, "\\\\")
      // Corrige aspas não escapadas dentro de strings
      .replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match) => {
        return match.replace(/(?<!\\)"/g, '\\"')
      })
  )
}

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "public", "data")
    const postsPath = path.join(dataDir, "posts.json")

    // Verificar se o arquivo existe
    try {
      await fs.access(postsPath)
    } catch (error) {
      return NextResponse.json({ error: "Arquivo posts.json não encontrado" }, { status: 404 })
    }

    // Ler o arquivo
    const fileContent = await fs.readFile(postsPath, "utf-8")

    // Fazer backup do arquivo original
    const backupPath = path.join(dataDir, `posts.json.backup-${Date.now()}`)
    await fs.writeFile(backupPath, fileContent, "utf-8")

    try {
      // Tentar fazer parse do JSON original
      JSON.parse(fileContent)
      return NextResponse.json({ message: "O arquivo JSON já está válido, nenhuma correção necessária" })
    } catch (parseError) {
      // O JSON está inválido, tentar corrigir
      const cleanedContent = cleanJsonString(fileContent)

      try {
        // Verificar se o JSON limpo é válido
        const parsedData = JSON.parse(cleanedContent)

        // Salvar o JSON corrigido
        await fs.writeFile(postsPath, JSON.stringify(parsedData, null, 2), "utf-8")

        return NextResponse.json({
          message: "Arquivo JSON corrigido com sucesso",
          backup: backupPath,
        })
      } catch (secondError) {
        // Se ainda não for possível corrigir, criar um arquivo novo com dados padrão
        const defaultPosts = [
          {
            id: "default-post",
            title: "Post Padrão",
            category: "Geral",
            publicationDate: new Date().toISOString().split("T")[0],
            imageUrl: "/placeholder.svg?height=300&width=600",
            summary: "Este é um post padrão criado automaticamente.",
            content:
              "# Post Padrão\n\nEste post foi criado automaticamente porque houve um problema com o arquivo JSON original.",
          },
        ]

        await fs.writeFile(postsPath, JSON.stringify(defaultPosts, null, 2), "utf-8")

        return NextResponse.json({
          message: "Não foi possível corrigir o JSON. Um novo arquivo com dados padrão foi criado.",
          backup: backupPath,
        })
      }
    }
  } catch (error) {
    console.error("Erro ao tentar corrigir o arquivo JSON:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

