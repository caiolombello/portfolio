"use client";

import type { Post } from "@/types";
import PostCard from "@/components/post-card";
import { useLanguage } from "@/contexts/language-context";
import { getBlogCopy } from "@/lib/blog-copy";

interface BlogGridProps {
  emptyMessage?: string;
  posts: Post[];
}

export function BlogGrid({ emptyMessage, posts }: BlogGridProps) {
  const { language } = useLanguage();
  const locale = language === "en" ? "en" : "pt";
  const copy = getBlogCopy(locale);

  if (posts.length === 0) {
    return <div className="rounded-2xl border border-dashed border-border/80 p-10 text-center text-sm text-muted-foreground">{emptyMessage || copy.empty}</div>;
  }

  return <div className="grid gap-5 md:grid-cols-2">{posts.map((post, index) => <PostCard key={locale === "en" ? post.slug_en : post.slug_pt} post={post} featured={index === 0} />)}</div>;
}
