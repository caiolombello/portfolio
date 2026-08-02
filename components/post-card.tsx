"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import type { Post } from "@/types/blog";
import { useLanguage } from "@/contexts/language-context";
import { formatBlogDateShort } from "@/lib/blog-date";
import { getBlogCopy } from "@/lib/blog-copy";
import { getLocalizedPost } from "@/lib/blog-post";

interface PostCardProps {
  featured?: boolean;
  post: Post;
}

export default function PostCard({ featured = false, post }: PostCardProps) {
  const { language } = useLanguage();
  const locale = language === "en" ? "en" : "pt";
  const copy = getBlogCopy(locale);
  const { category, slug, summary, tags, title } = getLocalizedPost(post, locale);

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/60 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_18px_60px_-32px_rgba(217,174,106,0.38)] ${featured ? "md:col-span-2 md:grid md:grid-cols-[1.15fr_0.85fr]" : ""}`}>
      <Link href={`/blog/${slug}`} className={`relative block aspect-[16/9] overflow-hidden bg-secondary ${featured ? "md:aspect-auto md:min-h-80" : ""}`} aria-label={`${copy.readArticle}: ${title}`}>
        {post.coverImage ? (
          <Image src={post.coverImage} alt="" fill priority={featured} sizes={featured ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 50vw"} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted"><FileText className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" /></div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {category && <span className="text-gold">{category}</span>}
          <time dateTime={post.publicationDate}>{formatBlogDateShort(post.publicationDate, locale)}</time>
        </div>
        <Link href={`/blog/${slug}`}>
          <h2 className="mt-4 line-clamp-2 text-xl font-semibold tracking-[-0.02em] text-foreground transition-colors group-hover:text-gold">{title}</h2>
        </Link>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{summary}</p>
        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => <span key={tag} className="rounded-full border border-border/80 bg-secondary/60 px-2.5 py-1 text-[11px] text-muted-foreground">{tag}</span>)}
          </div>
        )}
        <Link href={`/blog/${slug}`} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-gold">
          {copy.readArticle}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
