"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlogImage } from "@/components/blog/blog-image";
import type { Post } from "@/types";
import { useLanguage } from "@/contexts/language-context";

interface BlogGridProps {
  posts: Post[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  const { language } = useLanguage();

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-muted-foreground">
          {language === "en"
            ? "No posts published yet."
            : "Nenhum artigo publicado ainda."}
        </h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => {
        const slug = language === "pt" ? post.slug_pt : post.slug_en;
        const title = language === "pt" ? post.title_pt : post.title_en;
        const summary = language === "pt" ? post.summary_pt : post.summary_en;

        return (
          <Card key={slug || `post-${index}`} className="flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-2">{title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {summary}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="relative aspect-video">
                <BlogImage
                  src={post.coverImage}
                  alt={title}
                  fill
                  className="object-cover rounded-md"
                  size="small"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <time dateTime={post.publicationDate}>
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
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/blog/${slug}`}>
                  {language === "en" ? "Read more" : "Ler mais"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
