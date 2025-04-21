"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowPathIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { put } from "@vercel/blob";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImageUrl: string;
  onImageUploaded: (url: string) => void;
  label?: string;
  generateFavicon?: boolean;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  label = "Foto de Perfil",
  generateFavicon = true,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar o tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast.error("Tipo de arquivo inválido", {
        description: "Por favor, selecione uma imagem (JPEG, PNG, etc.)",
      });
      return;
    }

    // Validar o tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande", {
        description: "O tamanho máximo permitido é 5MB",
      });
      return;
    }

    // Criar preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      // Convert File to ArrayBuffer
      const arrayBuffer = await selectedFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload the image
      const { url } = await put(
        `portfolio-images/${selectedFile.name}`,
        buffer,
        {
          access: "public",
          addRandomSuffix: true,
        },
      );

      // If favicon generation is enabled, call the API route
      if (generateFavicon) {
        const response = await fetch("/api/favicon/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: url }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate favicon");
        }

        toast.success("Favicon generated successfully");
      }

      onImageUploaded(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  const cancelUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">{label}</label>

        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-border">
            <Image
              src={
                previewUrl ||
                currentImageUrl ||
                "/placeholder.svg?height=96&width=96"
              }
              alt="Foto de perfil"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {!previewUrl ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <ArrowUpTrayIcon className="mr-2 h-4 w-4" />
                Selecionar Imagem
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="default"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="mr-2 h-4 w-4" />
                      Enviar
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelUpload}
                  disabled={isUploading}
                >
                  <XMarkIcon className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
