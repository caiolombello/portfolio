"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { put } from "@vercel/blob"
import sharp from "sharp"

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
          // Ler o arquivo como buffer
          const imageBuffer = await file.arrayBuffer()
          
          // Gerar favicons em diferentes tamanhos
          const sizes = [16, 32, 48, 64, 96, 128, 192, 256, 384, 512]
          
          for (const size of sizes) {
            // Processar a imagem com sharp
            const processedImage = await sharp(Buffer.from(imageBuffer))
              .resize(size, size)
              .toFormat("png")
              .toBuffer()
            
            // Upload para o Blob Storage
            await put(`portfolio-images/favicon-${size}x${size}.png`, processedImage, {
              access: "public",
              contentType: "image/png",
            })
          }

          // Gerar favicon.ico (usando tamanho 32x32)
          const icoImage = await sharp(Buffer.from(imageBuffer))
            .resize(32, 32)
            .toFormat("png")
            .toBuffer()
          
          await put(`portfolio-images/favicon.ico`, icoImage, {
            access: "public",
            contentType: "image/x-icon",
          })

          // Gerar apple-touch-icon (usando tamanho 180x180)
          const appleIcon = await sharp(Buffer.from(imageBuffer))
            .resize(180, 180)
            .toFormat("png")
            .toBuffer()
          
          await put(`portfolio-images/apple-touch-icon.png`, appleIcon, {
            access: "public",
            contentType: "image/png",
          })

          console.log("Favicons e ícones gerados com sucesso")

          // Limpar o cache do navegador para os favicons
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

