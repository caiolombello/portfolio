"use client";

import type { Post } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Copy, Linkedin, Tag, Twitter } from "lucide-react";
import { formatBlogDate } from "@/lib/blog-date";
import { getBlogCopy } from "@/lib/blog-copy";
import { calculateReadingTime, getLocalizedPost } from "@/lib/blog-post";
import { useToast } from "@/hooks/use-toast";

interface BlogPostHeaderProps {
  post: Post;
  lang: "pt" | "en";
  siteUrl: string;
}

export default function BlogPostHeader({ post, lang, siteUrl }: BlogPostHeaderProps) {
  const copy = getBlogCopy(lang);
  const { body, category, slug, tags, title } = getLocalizedPost(post, lang);
  const { toast } = useToast();
  const postUrl = `${siteUrl}/blog/${slug}`;
  const authorName = typeof post.author === "object" ? post.author?.name : post.author;
  const authorAvatar = typeof post.author === "object" ? post.author?.avatar : undefined;

  return (
    <header className="mb-8 max-w-4xl sm:mb-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">{category || copy.categoryFallback}</p>
      <h1 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-[-0.035em] sm:text-5xl lg:text-6xl">{title}</h1>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground sm:mt-7">
        {authorName && <span className="inline-flex items-center gap-2"><Image src={authorAvatar || "/api/profile-image"} alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover" />{authorName}</span>}
        <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-gold" aria-hidden="true" /><time dateTime={post.publicationDate}>{formatBlogDate(post.publicationDate, lang)}</time></span>
        <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-gold" aria-hidden="true" />{calculateReadingTime(body)} {copy.readingTime}</span>
      </div>

      {tags && tags.length > 0 && <div className="mt-5 flex flex-wrap items-center gap-2"><Tag className="h-4 w-4 text-gold" aria-hidden="true" />{tags.map((tag) => <span key={tag} className="rounded-full border border-border/80 bg-secondary/60 px-2.5 py-1 text-xs text-muted-foreground">{tag}</span>)}</div>}

      <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-border/70 pt-5 sm:mt-7 sm:gap-3">
        <span className="mr-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{copy.share}</span>
        <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold" aria-label={copy.shareLinkedIn}><Linkedin className="h-4 w-4" aria-hidden="true" /></Link>
        <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold" aria-label={copy.shareX}><Twitter className="h-4 w-4" aria-hidden="true" /></Link>
        <button type="button" onClick={async () => {
          try {
            await navigator.clipboard.writeText(postUrl);
            toast({ title: copy.copied });
          } catch {
            toast({ title: copy.copyFailed, variant: "destructive" });
          }
        }} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold" aria-label={copy.copyLink}><Copy className="h-4 w-4" aria-hidden="true" /></button>
      </div>
    </header>
  );
}
