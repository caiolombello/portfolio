"use client";

import type React from "react";

import Head from "next/head";
import { usePathname } from "next/navigation";
import { useSiteConfig } from "@/hooks/use-site-config";

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  twitterCard?: "summary" | "summary_large_image";
  children?: React.ReactNode;
}

export default function MetaTags({
  title,
  description,
  image,
  type = "website",
  twitterCard = "summary_large_image",
  children,
}: MetaTagsProps) {
  const pathname = usePathname();
  const { config, loading } = useSiteConfig();

  // Usar configuração dinâmica para valores padrão
  const pageTitle = title || config.site.title;
  const pageDescription = description || config.site.description;
  const baseUrl = config.site.url;
  const url = `${baseUrl}${pathname}`;

  // Usar imagem dinâmica se não fornecida
  const defaultImage = image || `${baseUrl}/api/og${title ? `?title=${encodeURIComponent(title)}` : ''}`;
  const imageUrl = defaultImage.startsWith("http") ? defaultImage : `${baseUrl}${defaultImage}`;

  // Não renderizar se ainda carregando configuração
  if (loading) {
    return null;
  }

  return (
    <Head>
      {/* Tags básicas */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={config.site.shortName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content={config.integrations.twitterHandle} />
      <meta name="twitter:creator" content={config.integrations.twitterHandle} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Conteúdo adicional */}
      {children}
    </Head>
  );
}
