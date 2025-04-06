import type { Metadata } from "next"

interface PageSEOProps {
  title: string
  description: string
  path: string
  ogImage?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
}

export function generatePageMetadata({
  title,
  description,
  path,
  ogImage,
  type = "website",
  publishedTime,
  modifiedTime,
  authors = ["Caio Lombello"],
  tags = [],
}: PageSEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://caiolombelllo.com"
  const imageUrl = ogImage ? `${baseUrl}${ogImage}` : `${baseUrl}/api/og?title=${encodeURIComponent(title)}`

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}${path}`,
    },
    openGraph: {
      title,
      description,
      url: path,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  }

  // Adicionar metadados específicos para artigos
  if (type === "article") {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      authors,
      tags,
      publishedTime,
      modifiedTime,
    }
  }

  return metadata
}

