"use client";

import type { Post } from "@/types/blog";
import type { Dictionary } from "@/app/i18n/dictionaries";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Linkedin,
  Twitter,
  Copy,
  Calendar,
  Tag,
} from "lucide-react";

interface BlogPostHeaderProps {
  post: Post;
  dictionary: Dictionary;
  lang: string;
  siteUrl: string;
}

// Função para calcular o tempo de leitura
const calculateReadingTime = (text: string, wordsPerMinute = 200) => {
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

export default function BlogPostHeader({
  post,
  dictionary,
  lang,
  siteUrl,
}: BlogPostHeaderProps) {
  const {
    title_pt,
    title_en,
    summary_pt,
    summary_en,
    body_pt,
    body_en,
    author,
    tags_en,
    tags_pt,
    publicationDate,
    slug_pt,
    slug_en,
  } = post;

  const title = lang === "en" ? title_en : title_pt;
  const content = lang === "en" ? body_en : body_pt;
  const slug = lang === "en" ? slug_en : slug_pt;
  const tags = lang === "en" ? tags_en : tags_pt;
  const readingTime = calculateReadingTime(content ?? "");
  const postUrl = `${siteUrl}/blog/${slug}`;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      lang === "en" ? "en-US" : "pt-BR",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  return (
    <header className="mb-8">
      {/* Título e Subtítulo */}
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gold md:text-5xl">
        {title}
      </h1>

      {/* Meta do Post */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-muted-foreground">
        {/* Autor */}
        {author && (
          <div className="flex items-center gap-2">
            <Image
              src={(typeof author === 'object' ? author.avatar : null) ?? "/placeholder-user.jpg"}
              alt={typeof author === 'object' ? author.name : author}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-medium">
              {typeof author === 'object' ? author.name : author}
            </span>
          </div>
        )}

        {/* Data de Publicação */}
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <time dateTime={publicationDate}>
            {formatDate(publicationDate ?? new Date().toISOString())}
          </time>
        </div>

        {/* Tempo de Leitura */}
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>
            {readingTime} {dictionary.blog.readingTime}
          </span>
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Tag size={16} className="text-muted-foreground" />
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Ações de Compartilhamento */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm font-semibold text-muted-foreground">
          {dictionary.blog.share}:
        </span>
        <div className="flex gap-2">
          <Link
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(title ?? "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-secondary p-2 transition-colors hover:bg-primary"
          >
            <Linkedin size={20} />
          </Link>
          <Link
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(title ?? "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-secondary p-2 transition-colors hover:bg-primary"
          >
            <Twitter size={20} />
          </Link>
          <button
            onClick={() => navigator.clipboard.writeText(postUrl)}
            className="rounded-full bg-secondary p-2 transition-colors hover:bg-primary"
            aria-label="Copiar link"
          >
            <Copy size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
