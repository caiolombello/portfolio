interface SchemaOrgPerson {
  name: string;
  description?: string;
  image?: string;
  jobTitle?: string;
  url?: string;
  sameAs?: string[];
  email?: string;
  telephone?: string;
  address?: {
    addressLocality: string;
    addressRegion?: string;
    addressCountry: string;
  };
}

interface SchemaOrgArticle {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: SchemaOrgPerson | SchemaOrgPerson[];
  keywords?: string[];
  articleSection?: string;
  inLanguage: string;
}

interface SchemaOrgSoftwareApplication {
  name: string;
  description: string;
  image?: string;
  applicationCategory: string;
  operatingSystem?: string;
  author: SchemaOrgPerson;
  datePublished?: string;
  dateModified?: string;
  programmingLanguage?: string[];
  url?: string;
  downloadUrl?: string;
  softwareVersion?: string;
}

export function generatePersonSchema(person: SchemaOrgPerson) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    ...person,
  };
}

export function generateArticleSchema(article: SchemaOrgArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    ...article,
    author: Array.isArray(article.author)
      ? article.author.map((author) => ({ "@type": "Person", ...author }))
      : { "@type": "Person", ...article.author },
  };
}

export function generateSoftwareSchema(software: SchemaOrgSoftwareApplication) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    ...software,
    author: { "@type": "Person", ...software.author },
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebSiteSchema({
  name,
  description,
  url,
  author,
  inLanguage,
  keywords,
}: {
  name: string;
  description: string;
  url: string;
  author: SchemaOrgPerson;
  inLanguage: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description,
    url,
    author: { "@type": "Person", ...author },
    inLanguage,
    keywords: keywords?.join(", "),
  };
}
