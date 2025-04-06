import { NextResponse } from "next/server"
import { put, list } from "@vercel/blob"
import fs from "fs/promises"
import path from "path"

// Prefixo para todos os blobs relacionados ao site
const BLOB_PREFIX = "portfolio-data/"

// Caminho para o diretório de dados local
const DATA_DIR = path.join(process.cwd(), "public", "data")

// Verificar se estamos em ambiente de produção (Vercel)
const isProduction = process.env.NODE_ENV === "production"

export async function GET() {
  console.log("Verificando status do armazenamento...")

  const result = {
    blobStorage: {
      configured: false,
      working: false,
      error: null as string | null,
    },
    localStorage: {
      configured: false,
      working: false,
      readOnly: isProduction,
      error: null as string | null,
    },
    isConfigured: false,
    usingLocal: false,
    message: "",
  }

  // Verificar se o Blob Storage está configurado
  const isBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN
  result.blobStorage.configured = isBlobConfigured

  // Verificar se o Blob Storage está funcionando
  if (isBlobConfigured) {
    try {
      console.log("Testando Blob Storage...")

      // Criar um blob de teste
      const testContent = "Este é um arquivo de teste para verificar o Blob Storage."
      const testKey = `test-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.txt`

      const blob = await put(testKey, testContent, {
        contentType: "text/plain",
        access: "public",
      })

      console.log(`Blob de teste criado: ${blob.url}`)

      // Listar blobs para verificar se o blob de teste foi criado
      const { blobs } = await list()
      const testBlob = blobs.find((b) => b.pathname === testKey)

      if (testBlob) {
        console.log(`Blob de teste encontrado: ${testBlob.url}`)
        result.blobStorage.working = true
      } else {
        console.log(`Blob de teste não encontrado na lista`)
        result.blobStorage.error = "Blob de teste não encontrado após criação"
      }
    } catch (error) {
      console.error("Erro ao testar Blob Storage:", error)
      result.blobStorage.error = error instanceof Error ? error.message : "Erro desconhecido"
    }
  } else {
    console.log("Blob Storage não configurado")
  }

  // Verificar se o armazenamento local está funcionando para leitura
  try {
    console.log("Testando leitura do armazenamento local...")

    // Verificar se o diretório existe
    try {
      await fs.access(DATA_DIR)
      console.log(`Diretório ${DATA_DIR} existe`)

      // Listar arquivos no diretório
      const files = await fs.readdir(DATA_DIR)
      console.log(`Arquivos encontrados em ${DATA_DIR}: ${files.length}`)

      // Se chegou até aqui, o armazenamento local está funcionando para leitura
      result.localStorage.configured = true
      result.localStorage.working = true
    } catch (accessError) {
      console.error(`Erro ao acessar diretório ${DATA_DIR}:`, accessError)
      result.localStorage.error = `Diretório não acessível: ${accessError instanceof Error ? accessError.message : "Erro desconhecido"}`
    }

    // Se não estamos em produção, testar escrita
    if (!isProduction) {
      try {
        console.log("Testando escrita no armazenamento local...")

        // Garantir que o diretório existe
        await fs.mkdir(DATA_DIR, { recursive: true })

        // Criar um arquivo de teste
        const testFilePath = path.join(DATA_DIR, `test-${Date.now()}.txt`)
        await fs.writeFile(testFilePath, "Este é um arquivo de teste para verificar o armazenamento local.", "utf-8")

        // Verificar se o arquivo foi criado
        await fs.access(testFilePath)
        console.log(`Arquivo de teste criado: ${testFilePath}`)

        // Limpar o arquivo de teste
        try {
          await fs.unlink(testFilePath)
          console.log(`Arquivo de teste removido: ${testFilePath}`)
        } catch (deleteError) {
          console.error("Erro ao remover arquivo de teste:", deleteError)
        }
      } catch (writeError) {
        console.error("Erro ao testar escrita no armazenamento local:", writeError)
        result.localStorage.error = `Erro de escrita: ${writeError instanceof Error ? writeError.message : "Erro desconhecido"}`
        result.localStorage.working = false
      }
    }
  } catch (error) {
    console.error("Erro ao testar armazenamento local:", error)
    result.localStorage.error = error instanceof Error ? error.message : "Erro desconhecido"
  }

  // Definir o status geral
  if (result.blobStorage.working) {
    result.isConfigured = true
    result.usingLocal = false
    result.message = "Blob Storage configurado e funcionando corretamente."
  } else if (result.localStorage.working) {
    result.isConfigured = true
    result.usingLocal = true

    if (isProduction) {
      result.message =
        "Armazenamento local funcionando apenas para leitura. Alterações não serão salvas sem Blob Storage."
    } else {
      result.message = "Armazenamento local configurado e funcionando corretamente."
    }
  } else {
    result.isConfigured = false
    result.message = "Não foi possível usar o Blob Storage nem o armazenamento local."
  }

  console.log("Resultado da verificação:", result)

  return NextResponse.json(result)
}

