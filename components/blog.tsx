"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/types/blog";
import { useLanguage } from "@/contexts/language-context";

interface BlogProps {
  posts: Post[];
  limit?: number;
}

export default function Blog({ posts = [], limit }: BlogProps) {
  const { language } = useLanguage();
  const displayedPosts = limit && limit > 0 ? posts.slice(0, limit) : posts;

  if (posts.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="mb-12 text-center text-4xl font-bold text-gold">Blog</h1>
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold text-gold mb-4">Blog</h1>
        {limit && (
          <p className="text-muted-foreground text-center max-w-2xl">
            {language === "en"
              ? "Latest thoughts, tutorials, and insights."
              : "Últimos pensamentos, tutoriais e insights."}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedPosts.map((post) => {
          const title = language === "en" ? post.title_en : post.title_pt;
          const description = language === "en" ? post.summary_en : post.summary_pt;
          const slug = language === "en" ? post.slug_en : post.slug_pt;
          const date = post.publicationDate;

          return (
            <Card key={slug} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-2 text-xl">{title}</CardTitle>
                <CardDescription className="line-clamp-3 mt-2">{description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow py-4">
                <div className="relative aspect-video mb-4 overflow-hidden rounded-md bg-muted">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={title || ""}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary/50">
                      <span className="text-4xl">📝</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <time dateTime={date}>
                    {new Date(date).toLocaleDateString(language === "en" ? "en-US" : "pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  {post.author && (
                    <>
                      <span>•</span>
                      <span>{typeof post.author === 'string' ? post.author : post.author.name}</span>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild variant="outline" className="w-full group">
                  <Link href={`/blog/${slug}`}>
                    {language === "en" ? "Read more" : "Ler mais"}
                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {limit && (
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="group">
            <Link href="/blog">
              {language === "en" ? "View All Posts" : "Ver Todos os Posts"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
