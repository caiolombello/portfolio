"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Database, CheckCircle, XCircle, HardDrive, Lock } from "lucide-react"

export default function BlobStorageStatus() {
  const [checking, setChecking] = useState(true)
  const [status, setStatus] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const checkBlobStatus = async () => {
    try {
      setChecking(true)
      const response = await fetch("/api/admin/check-blob-status")

      if (response.ok) {
        const data = await response.json()
        setStatus(data)
        setError(null)
      } else {
        setStatus(null)
        setError("Não foi possível verificar o status do armazenamento")
      }
    } catch (error) {
      setStatus(null)
      setError("Erro ao verificar o status do armazenamento")
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    checkBlobStatus()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Status do Armazenamento de Dados
        </CardTitle>
        <CardDescription>Verifica como os dados do site estão sendo armazenados</CardDescription>
      </CardHeader>
      <CardContent>
        {checking ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Verificando configuração...</span>
          </div>
        ) : status ? (
          <>
            {status.blobStorage.working ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Blob Storage Configurado</AlertTitle>
                <AlertDescription className="text-green-700">
                  {status.message ||
                    "O Vercel Blob Storage está configurado corretamente. Suas alterações serão salvas de forma persistente."}
                </AlertDescription>
              </Alert>
            ) : status.localStorage.working && status.localStorage.readOnly ? (
              <Alert className="bg-amber-50 border-amber-200">
                <Lock className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Armazenamento Somente Leitura</AlertTitle>
                <AlertDescription className="text-amber-700">
                  {status.message ||
                    "O armazenamento local está funcionando apenas para leitura. Alterações não serão salvas sem Blob Storage."}
                  <div className="mt-2">
                    <p className="text-sm">
                      Para habilitar a persistência de dados, configure o Blob Storage adicionando a variável de
                      ambiente <code>BLOB_READ_WRITE_TOKEN</code> no seu projeto Vercel.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            ) : status.localStorage.working && !status.localStorage.readOnly ? (
              <Alert className="bg-amber-50 border-amber-200">
                <HardDrive className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Usando Armazenamento Local</AlertTitle>
                <AlertDescription className="text-amber-700">
                  {status.message || "Os dados estão sendo armazenados localmente no sistema de arquivos."}
                  <div className="mt-2">
                    <p className="text-sm">
                      Para usar o Blob Storage em produção, adicione a variável de ambiente{" "}
                      <code>BLOB_READ_WRITE_TOKEN</code> no seu projeto Vercel.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Armazenamento Não Configurado</AlertTitle>
                <AlertDescription>
                  {status.message ||
                    "Não foi possível configurar o armazenamento de dados. Suas alterações podem não ser persistentes."}
                  <div className="mt-4">
                    <p className="text-sm mb-2">
                      Para configurar o Blob Storage, adicione a variável de ambiente <code>BLOB_READ_WRITE_TOKEN</code>{" "}
                      no seu projeto Vercel.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open("https://vercel.com/docs/storage/vercel-blob/quickstart", "_blank")}
                      >
                        Ver Documentação
                      </Button>
                      <Button variant="default" size="sm" onClick={checkBlobStatus}>
                        Verificar Novamente
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Detalhes técnicos (opcional) */}
            <div className="mt-4">
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer">Detalhes técnicos</summary>
                <div className="mt-2 space-y-2 p-2 bg-secondary/30 rounded-md">
                  <div>
                    <strong>Blob Storage:</strong> {status.blobStorage.working ? "Funcionando" : "Não funcionando"}
                    {status.blobStorage.error && <div className="text-red-500">Erro: {status.blobStorage.error}</div>}
                  </div>
                  <div>
                    <strong>Armazenamento Local:</strong>{" "}
                    {status.localStorage.working ? "Funcionando" : "Não funcionando"}
                    {status.localStorage.readOnly && <span className="ml-1 text-amber-500">(somente leitura)</span>}
                    {status.localStorage.error && <div className="text-red-500">Erro: {status.localStorage.error}</div>}
                  </div>
                </div>
              </details>
            </div>
          </>
        ) : (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Erro ao Verificar Status</AlertTitle>
            <AlertDescription>
              {error || "Ocorreu um erro ao verificar o status do armazenamento."}
              <div className="mt-2">
                <Button variant="default" size="sm" onClick={checkBlobStatus}>
                  Tentar Novamente
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

