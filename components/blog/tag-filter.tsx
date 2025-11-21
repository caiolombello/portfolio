"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Filter, Search } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { Post } from "@/types";

interface TagFilterProps {
  posts: Post[];
  onFilteredPostsChange: (filteredPosts: Post[]) => void;
}

export function TagFilter({ posts, onFilteredPostsChange }: TagFilterProps) {
  const { language } = useLanguage();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Extrair todas as tags únicas dos posts
  const allTags = Array.from(
    new Set(
      posts.flatMap(post => post.tags || [])
    )
  ).sort();

  // Filtrar posts com base nas tags selecionadas e busca
  useEffect(() => {
    let filtered = posts;

    // Filtro por tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.some(tag => post.tags?.includes(tag))
      );
    }

    // Filtro por busca de texto
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => {
        const title = language === "en" ? post.title_en : post.title_pt;
        const desc = language === "en" ? post.summary_en : post.summary_pt;
        return (
          title.toLowerCase().includes(query) ||
          desc.toLowerCase().includes(query)
        );
      });
    }

    onFilteredPostsChange(filtered);
  }, [selectedTags, searchQuery, posts, onFilteredPostsChange, language]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  if (allTags.length === 0) {
    return null; // Não mostrar filtro se não há tags
  }

  return (
    <div className="mb-8 space-y-6 rounded-lg border bg-card p-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={language === "en" ? "Search posts..." : "Buscar posts..."}
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label={language === "en" ? "Search posts" : "Buscar posts"}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground">
              {language === "en" ? "Filter by tags" : "Filtrar por tags"}
            </h3>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              {allTags.length} {language === "en" ? "tags" : "tags"}
            </span>
          </div>
          {(selectedTags.length > 0 || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              {language === "en" ? "Clear all" : "Limpar tudo"}
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => {
            const isSelected = selectedTags.includes(tag);
            const postCount = posts.filter(post => post.tags?.includes(tag)).length;

            return (
              <Badge
                key={tag}
                variant={isSelected ? "default" : "secondary"}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${isSelected
                  ? "bg-gold text-gold-foreground shadow-md"
                  : "hover:bg-gold/20"
                  }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
                <span className="ml-1 text-xs opacity-75">
                  ({postCount})
                </span>
              </Badge>
            );
          })}
        </div>

        {selectedTags.length > 0 && (
          <div className="text-sm text-muted-foreground bg-gold/5 rounded-md p-3">
            <div className="font-medium text-foreground mb-1">
              {language === "en" ? "Active filters:" : "Filtros ativos:"}
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedTags.map((tag, index) => (
                <span key={tag}>
                  {index > 0 && <span className="text-muted-foreground">, </span>}
                  <span className="text-gold font-medium">{tag}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
