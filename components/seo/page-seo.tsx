"use client";

import { useSiteConfig } from "@/hooks/use-site-config";
import type { Metadata } from "next";

interface PageSEOProps {
  title: string;
  description?: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  url?: string;
  type?: "website" | "article";
  keywords?: string[];
  authors?: string[];
  tags?: string[];
}

export default function PageSEO({
  title,
  description,
  image,
  publishedTime,
  modifiedTime,
  url,
  type = "website",
  keywords = [],
  authors,
  tags = [],
}: PageSEOProps) {
  const { config, loading } = useSiteConfig();

  if (loading) {
    return null;
  }

  // Usar configuração dinâmica para valores padrão
  const pageDescription = description || config.site.description;

  let pageImage: string;
  if (image) {
    // Se a imagem for um caminho relativo, adicione a URL base.
    pageImage = image.startsWith('http') ? image : `${config.site.url}${image}`;
  } else if (config.og?.strategy === 'static') {
    // Se a estratégia for estática, use a imagem padrão do site.
    pageImage = `${config.site.url}${config.og.image}`;
  } else {
    // Caso contrário, use a geração de imagem dinâmica como fallback.
    pageImage = `${config.site.url}/api/og?title=${encodeURIComponent(title)}`;
  }

  const pageUrl = url || config.site.url;
  const pageAuthors = authors || [config.site.author];
  const pageKeywords = keywords.length > 0 ? keywords : config.seo.keywords;

  return (
    <>
      {/* Meta tags básicas */}
      <title>{title}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords.join(", ")} />
      <meta name="author" content={pageAuthors.join(", ")} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content={config.site.shortName} />
      <meta property="og:locale" content="pt_BR" />

      {pageImage && (
        <>
          <meta property="og:image" content={pageImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={title} />
        </>
      )}

      {/* Article específico */}
      {type === "article" && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {pageAuthors.map((author, index) => (
            <meta key={index} property="article:author" content={author} />
          ))}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:site" content={config.integrations.twitterHandle} />
      <meta name="twitter:creator" content={config.integrations.twitterHandle} />

      {pageImage && (
        <meta name="twitter:image" content={pageImage} />
      )}

      {/* Canonical */}
      <link rel="canonical" href={pageUrl} />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": type === "article" ? "Article" : "WebPage",
            headline: title,
            description: pageDescription,
            url: pageUrl,
            author: {
              "@type": "Person",
              name: pageAuthors[0],
              url: config.site.url,
            },
            publisher: {
              "@type": "Organization",
              name: config.site.shortName,
              url: config.site.url,
            },
            ...(pageImage && { image: pageImage }),
            ...(publishedTime && { datePublished: publishedTime }),
            ...(modifiedTime && { dateModified: modifiedTime }),
            ...(type === "article" && {
              keywords: tags.join(", "),
            }),
          }),
        }}
      />
    </>
  );
}
