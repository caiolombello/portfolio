import { Metadata } from "next";
import { SITE_CONFIG } from "./constants";
import { getSiteConfig, type SiteConfig } from "./config-server";
import { buildOgImageUrl } from "./seo";

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
}

export function generateMetadata({
  title,
  description = SITE_CONFIG.description,
  image = SITE_CONFIG.ogImage,
  noIndex = false,
  alternates,
}: GenerateMetadataOptions = {}): Metadata {
  const finalTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.name;

  return {
    title: finalTitle,
    description,
    openGraph: {
      title: finalTitle,
      description,
      images: [{ url: image }],
      type: "website",
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    alternates,
  };
}

export function generateJsonLd(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify(data),
  };
}

export function generatePersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Caio Barbieri",
    url: SITE_CONFIG.url,
    sameAs: [SITE_CONFIG.links.github, SITE_CONFIG.links.linkedin],
  };
}

export function generateBlogPostJsonLd({
  title,
  description,
  publishDate,
  updateDate,
  image,
  url,
}: {
  title: string;
  description: string;
  publishDate: string;
  updateDate?: string;
  image?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: image || SITE_CONFIG.ogImage,
    datePublished: publishDate,
    dateModified: updateDate || publishDate,
    author: generatePersonJsonLd(),
    publisher: generatePersonJsonLd(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

// Função para gerar metadata base dinâmico
export function generateSiteMetadata(): Metadata {
  const config = getSiteConfig();
  
  return {
    title: {
      default: config.site.shortName,
      template: `%s | ${config.site.shortName}`,
    },
    description: config.site.description,
    keywords: config.seo.keywords,
    authors: [{ name: config.site.author, url: config.site.url }],
    creator: config.site.author,
    publisher: config.site.author,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    alternates: {
      canonical: config.site.url,
      languages: {
        "pt-BR": `${config.site.url}/pt`,
        "en-US": `${config.site.url}/en`,
        "es-ES": `${config.site.url}/es`,
      },
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: config.site.url,
      title: config.site.title,
      description: config.site.description,
      siteName: config.site.shortName,
      images: [
        {
          url: buildOgImageUrl({ title: config.site.shortName }),
          width: 1200,
          height: 630,
          alt: config.site.shortName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.site.title,
      description: config.site.description,
      site: config.integrations.twitterHandle,
      creator: config.integrations.twitterHandle,
      images: [buildOgImageUrl({ title: config.site.shortName })],
    },
    manifest: `${config.site.url}/api/webmanifest`,
  };
}

// Função para gerar metadata de página específica
export function generatePageMetadata(
  title: string,
  description?: string,
  image?: string,
  noIndex?: boolean
): Metadata {
  const config = getSiteConfig();
  const pageDescription = description || config.site.description;
  const pageImage = image || buildOgImageUrl({ title });
  
  return {
    title,
    description: pageDescription,
    keywords: config.seo.keywords,
    authors: [{ name: config.site.author, url: config.site.url }],
    robots: noIndex ? "noindex,nofollow" : undefined,
    openGraph: {
      title,
      description: pageDescription,
      url: config.site.url,
      siteName: config.site.shortName,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: pageDescription,
      site: config.integrations.twitterHandle,
      creator: config.integrations.twitterHandle,
      images: [pageImage],
    },
  };
}

// Função para gerar structured data
export function generateStructuredData() {
  const config = getSiteConfig();
  
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: config.site.author,
    url: config.site.url,
    jobTitle: config.site.title.split(" - ")[1] || "Professional",
    worksFor: {
      "@type": "Organization",
      name: config.site.shortName,
    },
    sameAs: [
      config.social.github,
      config.social.linkedin,
      config.social.twitter,
      config.social.website,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: config.site.location,
    },
    email: config.site.email,
  };
}

// Re-export types and functions for compatibility
export type { SiteConfig };
export { getSiteConfig };
