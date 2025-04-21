"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { marked } from "marked";
import { useLanguage } from "@/contexts/language-context";
import type { Post } from "@/types";
import { useEffect, useState } from "react";

interface BlogPostContentProps {
  post: Post;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const { language } = useLanguage();
  const [parsedContent, setParsedContent] = useState("");

  const title = language === "pt" ? post.title_pt : post.title_en;
  const summary = language === "pt" ? post.summary_pt : post.summary_en;
  const content = language === "pt" ? post.body_pt : post.body_en;

  useEffect(() => {
    const parseContent = async () => {
      const result = await Promise.resolve(marked.parse(content ?? ""));
      setParsedContent(result);
    };
    parseContent();
  }, [content]);

  return (
    <article className="container mx-auto px-4 py-8">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {language === "en" ? "Back to blog" : "Voltar para o blog"}
      </Link>

      <Card>
        <CardContent className="p-6">
          <header className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {post.tags &&
                post.tags.length > 0 &&
                post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              <time
                className="text-sm text-muted-foreground"
                dateTime={post.publicationDate}
              >
                {new Date(post.publicationDate).toLocaleDateString(
                  language === "en" ? "en-US" : "pt-BR",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </time>
            </div>

            <h1 className="mb-4 text-3xl font-bold">{title}</h1>
            {summary && (
              <p className="text-lg text-muted-foreground">{summary}</p>
            )}
            {post.coverImage && (
              <Image
                src={post.coverImage}
                alt={title}
                width={1200}
                height={630}
                className="mt-4 rounded-lg"
                priority
              />
            )}
          </header>

          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        </CardContent>
      </Card>
    </article>
  );
}
