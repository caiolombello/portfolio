import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getBlob } from "@/lib/blob-storage"

// Função avançada para limpar e corrigir JSON corrompido
function repairJsonString(str: string): string {
  // Fazer backup do conteúdo original
  const original = str

  try {
    // Etapa 1: Remover caracteres de controle
    let cleaned = str.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")

    // Etapa 2: Corrigir aspas não escapadas dentro de strings
    // Isso é mais complexo e pode não funcionar em todos os casos
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

    if (matches && matches.length > 0) {
      // Tentar corrigir cada objeto individualmente
      const correctedPosts = matches
        .map((postStr) => {
          try {
            // Limpar o objeto individual
            const cleanedPost = postStr
              .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
              .replace(/\\(?!["\\/bfnrt])/g, "\\\\")
              .replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match) => {
                return match.replace(/(?<!\\)"/g, '\\"')
              })

            // Verificar se é um JSON válido
            JSON.parse(cleanedPost)
            return cleanedPost
          } catch (e) {
            // Se não conseguir corrigir, retornar null
            return null
          }
        })
        .filter((post) => post !== null)

      if (correctedPosts.length > 0) {
        return `[${correctedPosts.join(",")}]`
      }
    }

    // Se todas as tentativas falharem, retornar um array vazio válido
    return "[]"
  } catch (error) {
    // Em caso de erro no processo de reparo, retornar um array vazio válido
    console.error("Erro ao tentar reparar o JSON:", error)
    return "[]"
  }
}

export async function GET() {
  try {
    // Verificar se o arquivo existe e tentar ler
    const currentBlob = await getBlob("posts.json")
    if (!currentBlob) {
      return NextResponse.json(
        {
          success: false,
          error: "Arquivo não encontrado",
        },
        { status: 404 },
      )
    }

    const fileContent = await currentBlob.text()

    // Tentar fazer parse do JSON original
    try {
      JSON.parse(fileContent)
      return NextResponse.json({
        success: true,
        message: "O arquivo JSON já está válido, nenhuma correção necessária",
      })
    } catch (parseError) {
      // O JSON está inválido, tentar corrigir

      // Fazer backup do arquivo original
      const backupName = `posts.json.backup-${Date.now()}`
      await put(backupName, fileContent, {
        access: "public",
      })

      // Tentar reparar o JSON
      const repairedJson = repairJsonString(fileContent)

      try {
        // Verificar se o JSON reparado é válido
        const parsedData = JSON.parse(repairedJson)

        // Salvar o JSON corrigido
        await put("posts.json", repairedJson, {
          access: "public",
        })

        return NextResponse.json({
          success: true,
          message: "Arquivo JSON corrigido com sucesso",
          backup: backupName,
          postsRecovered: parsedData.length,
        })
      } catch (secondError) {
        // Se ainda não for possível corrigir, retornar erro
        return NextResponse.json(
          {
            success: false,
            error: "Não foi possível corrigir o JSON",
            backup: backupName,
          },
          { status: 500 },
        )
      }
    }
  } catch (error) {
    console.error("Erro ao tentar corrigir o arquivo JSON:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar a solicitação",
      },
      { status: 500 },
    )
  }
}

