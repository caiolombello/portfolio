"use client";

import { useLanguage } from "@/contexts/language-context";
import { getBlogCopy } from "@/lib/blog-copy";
import type { Post } from "@/types";

interface BlogStatsProps {
  totalPosts: number;
  filteredPosts: number;
  isFiltered: boolean;
}

export function BlogStats({ totalPosts, filteredPosts, isFiltered }: BlogStatsProps) {
  const { language } = useLanguage();
  const copy = getBlogCopy(language === "en" ? "en" : "pt");
  const articleLabel = (count: number) =>
    count === 1 ? copy.articleSingular : copy.articlePlural;

  if (totalPosts === 0) return null;

  return (
    <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
      <div>
        {isFiltered ? (
          <>
            {copy.showing}{" "}
            <span className="font-medium text-gold">{filteredPosts}</span>{" "}
            {articleLabel(filteredPosts)} {copy.of}{" "}
            <span className="font-medium">{totalPosts}</span>
          </>
        ) : (
          <>
            <span className="font-medium">{totalPosts}</span>{" "}
            {articleLabel(totalPosts)} {copy.total}
          </>
        )}
      </div>
      
      {isFiltered && (
        <div className="text-xs">
          {copy.filteredResults}
        </div>
      )}
    </div>
  );
}
