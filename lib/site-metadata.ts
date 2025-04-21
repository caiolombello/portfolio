import { Metadata } from "next";
import { SITE_CONFIG } from "./constants";

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
