"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { put } from "@vercel/blob"

interface ImageUploadProps {
  currentImageUrl: string
  onImageUploaded: (url: string) => void
  label?: string
  generateFavicon?: boolean
}

export default function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  label = "Foto de Perfil",
  generateFavicon = true,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar o tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    // Validar o tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB",
        variant: "destructive",
      })
      return
    }

    // Criar preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
  }

  const uploadImage = async () => {
    if (!fileInputRef.current?.files?.[0]) return

    const file = fileInputRef.current.files[0]
    setIsUploading(true)

    try {
      // Gerar um nome de arquivo único baseado na data e nome original
      const filename = `profile-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`

      // Upload para o Vercel Blob Storage
      const blob = await put(`portfolio-images/${filename}`, file, {
        access: "public",
        contentType: file.type,
      })

      // Se a opção de gerar favicon estiver ativada, também fazer upload de uma versão como favicon
      if (generateFavicon) {
        try {
          // Fazer upload da mesma imagem como favicon
          // Não precisamos processar a imagem aqui, pois o navegador redimensionará automaticamente
          await put(`portfolio-images/profile-favicon.png`, file, {
            access: "public",
            contentType: "image/png",
          })

          // Fazer upload da mesma imagem como apple-touch-icon
          await put(`portfolio-images/profile-apple-icon.png`, file, {
            access: "public",
            contentType: "image/png",
          })

          console.log("Favicon e apple-touch-icon gerados com sucesso")

          // Limpar o cache do navegador para os favicons
          // Isso não é perfeito, mas pode ajudar em alguns casos
          if (typeof window !== "undefined") {
            const faviconLinks = document.querySelectorAll('link[rel*="icon"]')
            faviconLinks.forEach((link) => {
              const href = link.getAttribute("href")
              if (href) {
                link.setAttribute("href", `${href}?v=${Date.now()}`)
              }
            })
          }
        } catch (faviconError) {
          console.error("Erro ao gerar favicon:", faviconError)
          // Não interromper o fluxo principal se o favicon falhar
        }
      }

      // Retornar a URL da imagem
      onImageUploaded(blob.url)

      toast({
        title: "Imagem enviada com sucesso",
        description: "Sua foto de perfil foi atualizada.",
      })
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error)
      toast({
        title: "Erro ao enviar imagem",
        description: "Não foi possível fazer o upload da imagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const cancelUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">{label}</label>

        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-border">
            <Image
              src={previewUrl || currentImageUrl || "/placeholder.svg?height=96&width=96"}
              alt="Foto de perfil"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

            {!previewUrl ? (
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Selecionar Imagem
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button type="button" variant="default" onClick={uploadImage} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Enviar
                    </>
                  )}
                </Button>

                <Button type="button" variant="outline" onClick={cancelUpload} disabled={isUploading}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

