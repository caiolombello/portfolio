import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const postsPath = path.join(process.cwd(), "public", "data", "posts.json")

// Função avançada para limpar e corrigir JSON corrompido
function repairJsonString(str: string): string {
  // Fazer backup do conteúdo original
  const original = str

  try {
    // Etapa 1: Remover caracteres de controle
    let cleaned = str.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")

    // Etapa 2: Corrigir aspas não escapadas dentro de strings
    cleaned = cleaned.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match) => {
      return match.replace(/(?<!\\)"/g, '\\"')
    })

    // Etapa 3: Corrigir barras invertidas não escapadas
    cleaned = cleaned.replace(/\\(?!["\\/bfnrt])/g, "\\\\")

    // Verificar se o JSON está válido
    try {
      JSON.parse(cleaned)
      return cleaned
    } catch (error) {
      // Se ainda não estiver válido, tentar uma abordagem mais agressiva
    }

    // Etapa 4: Abordagem mais agressiva - extrair os objetos principais
    // Isso é uma tentativa de recuperar pelo menos parte dos dados
    const postPattern = /\{\s*"id"\s*:\s*"[^"]*"[^}]*\}/g
    const matches = original.match(postPattern)
    if (matches) {
      return `[${matches.join(",")}]`
    }

    // Se não conseguir reparar, retorna o original
    return original
  } catch (error) {
    return str
  }
}

export async function POST(request: Request) {
  try {
    const { corruptedJson } = await request.json()
    if (!corruptedJson) {
      return NextResponse.json({ error: "JSON corrompido não fornecido" }, { status: 400 })
    }
    const repaired = repairJsonString(corruptedJson)
    await fs.writeFile(postsPath, repaired, "utf-8")
    return NextResponse.json({ success: true, repaired })
  } catch (error) {
    console.error("Erro ao reparar JSON:", error)
    return NextResponse.json({ error: "Erro ao reparar JSON" }, { status: 500 })
  }
}

