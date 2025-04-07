"use client"

import type React from "react"

import Head from "next/head"
import { usePathname } from "next/navigation"

interface MetaTagsProps {
  title?: string
  description?: string
  image?: string
  type?: "website" | "article"
  twitterCard?: "summary" | "summary_large_image"
  children?: React.ReactNode
}

export default function MetaTags({
  title = "Caio Lombello - DevOps Engineer",
  description = "Portfólio de Caio Lombello, DevOps Engineer com foco em Cloud Native, Kubernetes e automação de infraestrutura.",
  image = "/images/og-image.jpg",
  type = "website",
  twitterCard = "summary_large_image",
  children,
}: MetaTagsProps) {
  const pathname = usePathname()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://caio.lombello.com"
  const url = `${baseUrl}${pathname}`

  // Garantir que a imagem tenha URL completa
  const imageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`

  return (
    <Head>
      {/* Tags básicas */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Conteúdo adicional */}
      {children}
    </Head>
  )
}

