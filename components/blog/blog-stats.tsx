"use client";

import { useLanguage } from "@/contexts/language-context";
import type { Post } from "@/types";

interface BlogStatsProps {
  totalPosts: number;
  filteredPosts: number;
  isFiltered: boolean;
}

export function BlogStats({ totalPosts, filteredPosts, isFiltered }: BlogStatsProps) {
  const { language } = useLanguage();

  if (totalPosts === 0) return null;

  return (
    <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
      <div>
        {isFiltered ? (
          language === "en" ? (
            <>
              Showing <span className="font-medium text-gold">{filteredPosts}</span> of{" "}
              <span className="font-medium">{totalPosts}</span> posts
            </>
          ) : (
            <>
              Mostrando <span className="font-medium text-gold">{filteredPosts}</span> de{" "}
              <span className="font-medium">{totalPosts}</span> posts
            </>
          )
        ) : (
          language === "en" ? (
            <>
              <span className="font-medium">{totalPosts}</span> posts total
            </>
          ) : (
            <>
              <span className="font-medium">{totalPosts}</span> posts no total
            </>
          )
        )}
      </div>
      
      {isFiltered && (
        <div className="text-xs">
          {language === "en" ? "Filtered results" : "Resultados filtrados"}
        </div>
      )}
    </div>
  );
} 