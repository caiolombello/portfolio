"use client";

import { useMemo } from "react";
import { PreviewWrapper } from "./preview-wrapper";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { format } from "date-fns";
import { CmsEntry } from "@/types/cms";

interface PostPreviewProps {
  entry: CmsEntry<{
    title: string;
    date: string;
    content: string;
    image: string;
    excerpt: string;
    tags: string[];
  }>;
}

export function PostPreview({ entry }: PostPreviewProps) {
  const title = (entry.getIn(["data", "title"]) || "").toString();
  const description = (entry.getIn(["data", "description"]) || "").toString();
  const date = entry.getIn(["data", "date"]) || new Date();
  const content = (entry.getIn(["data", "body"]) || "").toString();
  const coverImage = (entry.getIn(["data", "coverImage"]) || "").toString();
  const locale = (entry.getIn(["data", "locale"]) || "en").toString();

  const formattedDate = useMemo(() => {
    const postDate = entry.getIn(["data", "date"]);
    if (!postDate) return format(new Date(), "MMMM dd, yyyy");
    return format(new Date(postDate.toString()), "MMMM dd, yyyy");
  }, [entry]);

  return (
    <PreviewWrapper locale={locale}>
      <article className="mx-auto max-w-2xl space-y-8 py-8">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-xl text-muted-foreground">{description}</p>
          )}
          <time className="text-sm text-muted-foreground">{formattedDate}</time>
        </header>

        {coverImage && (
          <div className="aspect-video overflow-hidden rounded-lg">
            <OptimizedImage
              src={coverImage}
              alt={title}
              width={1200}
              height={630}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-neutral dark:prose-invert">{content}</div>
      </article>
    </PreviewWrapper>
  );
}
