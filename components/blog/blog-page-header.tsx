"use client";

import { useLanguage } from "@/contexts/language-context";
import { getBlogCopy } from "@/lib/blog-copy";

export default function BlogPageHeader() {
  const { language } = useLanguage();
  const copy = getBlogCopy(language === "en" ? "en" : "pt");
  return (
    <header className="mb-12 max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Blog</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">{copy.pageTitle}</h1>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">{copy.pageDescription}</p>
    </header>
  );
}
