"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import type { Post } from "@/types/blog";
import { useLanguage } from "@/contexts/language-context";
import { Reveal } from "@/components/motion/reveal";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";
import { formatBlogDateShort } from "@/lib/blog-date";
import { getBlogCopy } from "@/lib/blog-copy";
import { getLocalizedPost } from "@/lib/blog-post";

interface BlogProps {
  posts: Post[];
  limit?: number;
}

export default function Blog({ posts = [], limit }: BlogProps) {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const locale = isEnglish ? "en" : "pt";
  const copy = getBlogCopy(locale);
  const displayedPosts = limit && limit > 0 ? posts.slice(0, limit) : posts;

  return (
    <section
      className="container border-b border-border/70 py-14 sm:py-24"
      aria-labelledby="blog-title"
    >
      <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
            {isEnglish ? "Writing" : "Escrita"}
          </p>
          <h2
            id="blog-title"
            className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
          >
            {isEnglish
              ? "Notes from the platform layer."
              : "Notas da camada de plataforma."}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            {isEnglish
              ? "Practical notes on Kubernetes, observability, automation and delivery."
              : "Notas práticas sobre Kubernetes, observabilidade, automação e entrega."}
          </p>
        </div>
        <Link
          href={getLocalizedInstitutionalPath("/blog", isEnglish ? "en" : "pt")}
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-foreground"
        >
          {isEnglish ? "Browse the blog" : "Explorar o blog"}
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </Reveal>

      {displayedPosts.length === 0 ? (
        <Reveal delay={0.08}>
          <div className="mt-10 rounded-xl border border-dashed border-border/80 p-8 text-center text-sm text-muted-foreground">
            {isEnglish
              ? "New technical notes are on the way."
              : "Novas notas técnicas serão publicadas em breve."}
          </div>
        </Reveal>
      ) : (
        <Reveal
          className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-[1.25fr_0.75fr]"
          delay={0.08}
        >
          {displayedPosts.map((post) => {
            const { category, slug, summary: description, title } = getLocalizedPost(post, locale);
            const date = post.publicationDate;

            return (
              <article
                key={slug}
                className="surface-motion group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/60 sm:flex-row lg:first:row-span-2 lg:first:flex-col"
              >
                <Link
                  href={`/blog/${slug}`}
                  className="relative block aspect-[16/9] shrink-0 overflow-hidden bg-secondary sm:w-2/5 lg:w-auto lg:flex-1"
                  aria-label={`${isEnglish ? "Read" : "Ler"}: ${title}`}
                >
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 60vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted">
                      <FileText
                        className="h-10 w-10 text-muted-foreground/50"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {category && (
                      <span className="text-gold">{category}</span>
                    )}
                    <time dateTime={date}>
                      {formatBlogDateShort(date, locale)}
                    </time>
                  </div>
                  <Link href={`/blog/${slug}`}>
                    <h3 className="mt-4 line-clamp-2 text-xl font-semibold tracking-[-0.02em] text-foreground transition-colors group-hover:text-gold sm:text-2xl">
                      {title}
                    </h3>
                  </Link>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                  <Link
                    href={`/blog/${slug}`}
                    className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-gold"
                  >
                    {copy.readArticle}
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </Reveal>
      )}
    </section>
  );
}
