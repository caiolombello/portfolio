import { describe, expect, it } from "vitest";

import type { SiteConfig } from "./config-server";
import {
  buildBlogPostMetadata,
  buildPageMetadata,
} from "./seo-metadata";

const config: SiteConfig = {
  site: {
    name: "Caio Barbieri Portfolio",
    title: "Caio Barbieri - Senior DevOps Engineer & SRE",
    shortName: "Caio Barbieri",
    description: "Portfolio description",
    url: "https://caio.lombello.com",
    author: "Caio Barbieri",
    email: "caio@example.com",
    phone: "+55 19 99999-9999",
    location: "Campinas, SP",
    profileImage: "/images/Profile.jpg",
  },
  social: {
    github: "https://github.com/caiolombello",
    linkedin: "https://linkedin.com/in/caiolvbarbieri",
    twitter: "https://twitter.com/caiolombello",
    website: "https://caio.lombello.com",
  },
  integrations: {
    credlyUsername: "caiolombello",
    twitterHandle: "@caiolombello",
  },
  seo: { keywords: ["DevOps", "SRE"] },
};

describe("buildPageMetadata", () => {
  it("uses a self-referencing canonical and OpenGraph URL", () => {
    const metadata = buildPageMetadata({
      config,
      path: "/resume",
      locale: "pt",
      title: "Currículo",
      description: "Experiência profissional de Caio Barbieri.",
    });

    expect(metadata.alternates?.canonical).toBe(
      "https://caio.lombello.com/resume",
    );
    expect(metadata.openGraph?.url).toBe(
      "https://caio.lombello.com/resume",
    );
    expect(metadata.openGraph?.locale).toBe("pt_BR");
    expect(metadata.alternates?.languages).toEqual({
      "pt-BR": "https://caio.lombello.com/resume",
      "en-US": "https://caio.lombello.com/en/resume",
    });
  });

  it("uses the dedicated English URL as canonical", () => {
    const metadata = buildPageMetadata({
      config,
      path: "/resume",
      locale: "en",
      title: "Resume",
      description: "Caio Barbieri's professional experience.",
    });

    expect(metadata.alternates?.canonical).toBe(
      "https://caio.lombello.com/en/resume",
    );
    expect(metadata.openGraph?.url).toBe(
      "https://caio.lombello.com/en/resume",
    );
    expect(metadata.openGraph?.locale).toBe("en_US");
  });
});

describe("buildBlogPostMetadata", () => {
  const post = {
    slug_pt: "kubernetes-hpa.pt",
    slug_en: "kubernetes-hpa.en",
    title_pt: "Kubernetes HPA em produção",
    title_en: "Kubernetes HPA in production",
    summary_pt: "Resumo específico em português.",
    summary_en: "A post-specific summary in English.",
    body_pt: "Conteúdo",
    body_en: "Content",
    publicationDate: "2023-03-18",
    updatedAt: "2026-08-01",
    coverImage: "/images/posts/kubernetes-hpa.webp",
  };

  it("uses the localized summary and canonical for the English post", () => {
    const metadata = buildBlogPostMetadata({
      config,
      post,
      slug: post.slug_en,
    });

    expect(metadata.description).toBe(post.summary_en);
    expect(metadata.alternates?.canonical).toBe(
      "https://caio.lombello.com/blog/kubernetes-hpa.en",
    );
    expect(metadata.alternates?.languages).toEqual({
      "pt-BR": "https://caio.lombello.com/blog/kubernetes-hpa.pt",
      "en-US": "https://caio.lombello.com/blog/kubernetes-hpa.en",
    });
    expect(metadata.openGraph?.url).toBe(
      "https://caio.lombello.com/blog/kubernetes-hpa.en",
    );
    expect(metadata.openGraph?.locale).toBe("en_US");
    expect(metadata.openGraph).toMatchObject({ modifiedTime: "2026-08-01" });
  });
});
