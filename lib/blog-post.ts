import type { SiteLocale } from "./request-locale";
import type { Post } from "@/types/blog";

export interface LocalizedPost {
  body: string;
  category?: string;
  slug: string;
  summary: string;
  tags: string[];
  title: string;
}

export function getLocalizedPost(
  post: Post,
  language: SiteLocale,
): LocalizedPost {
  if (language === "en") {
    return {
      body: post.body_en,
      category: post.category_en || post.category,
      slug: post.slug_en,
      summary: post.summary_en,
      tags: post.tags_en || post.tags || [],
      title: post.title_en,
    };
  }

  return {
    body: post.body_pt,
    category: post.category_pt || post.category,
    slug: post.slug_pt,
    summary: post.summary_pt,
    tags: post.tags_pt || post.tags || [],
    title: post.title_pt,
  };
}

export function calculateReadingTime(
  content: string,
  wordsPerMinute = 200,
): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
