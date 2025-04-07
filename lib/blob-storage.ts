import { put, list } from '@vercel/blob'
import fs from "fs/promises"
import path from "path"

// Prefixo para todos os blobs relacionados ao site
const BLOB_PREFIX = "portfolio-data/"

// Verificar se o token do Blob está configurado
const isBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN

// Caminho para o diretório de dados local
const DATA_DIR = path.join(process.cwd(), "public", "data")

// Verificar se estamos em ambiente de produção (Vercel)
const isProduction = process.env.NODE_ENV === "production"

// Add type for blob object
interface BlobObject {
  pathname: string
  url: string
}

/**
 * Salva dados no Vercel Blob Storage ou no sistema de arquivos local
 * @param key Nome do arquivo (sem o prefixo)
 * @param data Dados a serem salvos (objeto que será convertido para JSON)
 */
export async function saveToBlob(key: string, data: any): Promise<{ success: boolean; error?: string }> {
  try {
    // Tentar salvar no Blob Storage se estiver configurado
    if (isBlobConfigured) {
      try {
        const blobKey = `${BLOB_PREFIX}${key}`
        const jsonData = JSON.stringify(data, null, 2)

        const blob = await put(blobKey, jsonData, {
          contentType: "application/json",
          access: "public",
        })

        console.log(`Arquivo ${key} salvo com sucesso no Blob Storage: ${blob.url}`)
        return { success: true }
      } catch (blobError) {
        console.error(`Erro ao salvar ${key} no Blob Storage:`, blobError)
        // Se falhar no Blob Storage e não estivermos em produção, tenta salvar localmente
      }
    }

    // Se o Blob Storage não estiver configurado ou falhar, tenta salvar localmente (apenas em desenvolvimento)
    if (!isProduction) {
      try {
        await saveToLocalFile(key, data)
        console.log(`Arquivo ${key} salvo localmente`)
        return {
          success: true,
          error: isBlobConfigured
            ? `Não foi possível salvar no Blob Storage, mas os dados foram salvos localmente.`
            : undefined,
        }
      } catch (localError) {
        console.error(`Erro ao salvar ${key} localmente:`, localError)
        return {
          success: false,
          error: `Não foi possível salvar os dados. Erro: ${localError instanceof Error ? localError.message : "Erro desconhecido"}`,
        }
      }
    } else {
      // Em produção, se o Blob Storage falhar, retorna erro
      if (isBlobConfigured) {
        return {
          success: false,
          error: "Não foi possível salvar no Blob Storage e o sistema de arquivos é somente leitura em produção.",
        }
      } else {
        return {
          success: false,
          error: "Blob Storage não configurado e o sistema de arquivos é somente leitura em produção.",
        }
      }
    }
  } catch (error) {
    console.error(`Erro ao salvar ${key}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido ao salvar",
    }
  }
}

/**
 * Salva dados em um arquivo local
 * @param key Nome do arquivo
 * @param data Dados a serem salvos
 */
async function saveToLocalFile(key: string, data: any): Promise<void> {
  try {
    // Garantir que o diretório existe
    await fs.mkdir(DATA_DIR, { recursive: true })

    // Remover a extensão .json se já estiver presente
    const baseKey = key.endsWith(".json") ? key.slice(0, -5) : key

    // Salvar o arquivo
    const filePath = path.join(DATA_DIR, `${baseKey}.json`)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
    console.log(`Arquivo ${key} salvo localmente em ${filePath}`)
  } catch (error) {
    console.error(`Erro ao salvar ${key} localmente:`, error)
    throw error
  }
}

/**
 * Carrega dados do Vercel Blob Storage ou do sistema de arquivos local
 * @param key Nome do arquivo (sem o prefixo)
 * @param defaultData Dados padrão a serem retornados em caso de erro
 */
export async function loadFromBlob<T>(key: string, defaultData: T): Promise<T> {
  console.log(`Tentando carregar ${key}...`)

  // Verificar se o Blob Storage está configurado
  if (isBlobConfigured) {
    try {
      // Construir a chave do blob
      const blobKey = `${BLOB_PREFIX}${key}`
      console.log(`Tentando carregar do Blob Storage: ${blobKey}`)

      // Listar todos os blobs para depuração
      try {
        const { blobs } = await list({ prefix: BLOB_PREFIX })
        console.log(
          `Blobs disponíveis com prefixo ${BLOB_PREFIX}:`,
          blobs.map((b: BlobObject) => b.pathname),
        )

        // Procurar o blob específico na lista
        const targetBlob = blobs.find((b: BlobObject) => b.pathname === blobKey)

        if (targetBlob) {
          console.log(`Blob encontrado na lista: ${targetBlob.pathname}, URL: ${targetBlob.url}`)

          // Fazer fetch do blob usando a URL
          const response = await fetch(targetBlob.url)

          if (response.ok) {
            const text = await response.text()
            console.log(`Conteúdo do blob: ${text.substring(0, 100)}...`)

            try {
              const data = JSON.parse(text) as T
              console.log(`Arquivo ${key} carregado com sucesso do Blob Storage`)
              return data
            } catch (parseError) {
              console.error(`Erro ao fazer parse do JSON do blob:`, parseError)
            }
          } else {
            console.error(`Erro ao fazer fetch do blob: ${response.status} ${response.statusText}`)
          }
        } else {
          console.log(`Blob ${blobKey} não encontrado na lista`)
        }
      } catch (listError) {
        console.error(`Erro ao listar blobs:`, listError)
      }
    } catch (blobError) {
      console.error(`Erro ao carregar ${key} do Blob Storage:`, blobError)
    }
  } else {
    console.log(`Blob Storage não configurado, pulando tentativa de carregar do Blob Storage`)
  }

  // Tentar carregar do sistema de arquivos local
  try {
    console.log(`Tentando carregar do sistema de arquivos local...`)
    const data = await loadFromLocalFile<T>(key)
    console.log(`Arquivo ${key} carregado com sucesso do sistema de arquivos local`)
    return data
  } catch (localError) {
    // Se o erro for ENOENT (arquivo não encontrado), retornar os dados padrão sem erro
    if (localError instanceof Error && "code" in localError && localError.code === "ENOENT") {
      console.log(`Arquivo ${key} não encontrado, retornando dados padrão`)
      return defaultData
    }
    console.error(`Erro ao carregar ${key} do sistema de arquivos local:`, localError)
  }

  // Se tudo falhar, retornar os dados padrão
  console.log(`Não foi possível carregar ${key} de nenhuma fonte, retornando dados padrão`)
  return defaultData
}

/**
 * Carrega dados de um arquivo local
 * @param key Nome do arquivo
 */
async function loadFromLocalFile<T>(key: string): Promise<T> {
  // Garantir que o diretório de dados existe
  const dataDir = path.join(process.cwd(), "public", "data")
  await ensureDirectory(dataDir)

  // Remover a extensão .json se já estiver presente
  const baseKey = key.endsWith(".json") ? key.slice(0, -5) : key

  const filePath = path.join(dataDir, `${baseKey}.json`)
  console.log(`Tentando carregar arquivo local: ${filePath}`)

  try {
    const fileContent = await fs.readFile(filePath, "utf-8")
    console.log(`Conteúdo do arquivo local: ${fileContent.substring(0, 100)}...`)
    return JSON.parse(fileContent) as T
  } catch (error) {
    // Repassar o erro para ser tratado na função chamadora
    console.error(`Erro ao ler arquivo local ${filePath}:`, error)
    throw error
  }
}

// Exportar a função loadFromLocalFile como loadFromFileSystem para compatibilidade
export const loadFromFileSystem = loadFromLocalFile

// Adicionar função para garantir que o diretório existe
async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath)
  } catch (error) {
    // Diretório não existe, vamos criá-lo
    await fs.mkdir(dirPath, { recursive: true })
    console.log(`Diretório criado: ${dirPath}`)
  }
}

/**
 * Verifica se um blob existe no Blob Storage ou no sistema de arquivos local
 * @param key Nome do arquivo (sem o prefixo)
 */
export async function blobExists(key: string): Promise<boolean> {
  try {
    // Verificar no Blob Storage se estiver configurado
    if (isBlobConfigured) {
      try {
        const blobKey = `${BLOB_PREFIX}${key}`
        console.log(`Verificando se o blob existe: ${blobKey}`)

        // Listar blobs para verificar se o blob existe
        const { blobs } = await list({ prefix: BLOB_PREFIX })
        const exists = blobs.some((b: BlobObject) => b.pathname === blobKey)

        if (exists) {
          console.log(`Blob ${blobKey} encontrado`)
          return true
        }
        console.log(`Blob ${blobKey} não encontrado`)
      } catch (error) {
        console.error(`Erro ao verificar se o blob existe:`, error)
      }
    }

    // Verificar localmente
    try {
      // Remover a extensão .json se já estiver presente
      const baseKey = key.endsWith(".json") ? key.slice(0, -5) : key
      const filePath = path.join(DATA_DIR, `${baseKey}.json`)
      console.log(`Verificando se o arquivo local existe: ${filePath}`)
      await fs.access(filePath)
      console.log(`Arquivo local ${filePath} encontrado`)
      return true
    } catch {
      console.log(`Arquivo local não encontrado`)
      return false
    }
  } catch (error) {
    console.error(`Erro ao verificar se o blob existe:`, error)
    return false
  }
}

/**
 * Lista todos os blobs com o prefixo especificado
 */
export async function listBlobs(): Promise<string[]> {
  const results = new Set<string>()

  try {
    // Listar do Blob Storage se estiver configurado
    if (isBlobConfigured) {
      try {
        console.log(`Listando blobs com prefixo ${BLOB_PREFIX}...`)
        const { blobs } = await list({ prefix: BLOB_PREFIX })
        console.log(`Encontrados ${blobs.length} blobs no Blob Storage`)

        blobs.forEach((blob: { pathname: string }) => {
          const key = blob.pathname.replace(BLOB_PREFIX, "").replace(".json", "")
          results.add(key)
          console.log(`Blob encontrado: ${blob.pathname} -> ${key}`)
        })
      } catch (error) {
        console.error("Erro ao listar blobs do Blob Storage:", error)
      }
    }

    // Listar arquivos locais
    try {
      console.log(`Listando arquivos locais em ${DATA_DIR}...`)
      const files = await fs.readdir(DATA_DIR)
      console.log(`Encontrados ${files.length} arquivos locais`)

      files.forEach((file: string) => {
        if (file.endsWith(".json")) {
          const key = file.replace(".json", "")
          results.add(key)
          console.log(`Arquivo local encontrado: ${file} -> ${key}`)
        }
      })
    } catch (error) {
      console.error("Erro ao listar arquivos locais:", error)
    }

    const resultArray = Array.from(results)
    console.log(`Total de blobs/arquivos encontrados: ${resultArray.length}`)
    return resultArray
  } catch (error) {
    console.error("Erro ao listar blobs:", error)
    return []
  }
}

/**
 * Obtém um blob específico do Blob Storage
 * @param filename Nome do arquivo (sem o prefixo)
 */
export async function getBlob(filename: string) {
  try {
    const blobKey = `${BLOB_PREFIX}${filename}`
    
    // List blobs with the specific prefix
    const { blobs } = await list({ prefix: blobKey })
    const blob = blobs[0] // Get the first blob that matches
    
    if (!blob) return null
    
    // Fetch the actual content of the blob
    const response = await fetch(blob.url)
    if (!response.ok) return null
    
    return await response.text()
  } catch (error) {
    console.error(`Error getting blob ${filename}:`, error)
    return null
  }
}

export async function uploadFile(file: File, path: string) {
  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const blob = await put(path, buffer, {
    access: 'public',
    addRandomSuffix: true,
  })

  return blob.url
}

export async function listFiles(prefix: string) {
  const { blobs } = await list({ prefix })
  return blobs
}

export async function getFile(path: string) {
  const response = await fetch(path)
  return response
}

