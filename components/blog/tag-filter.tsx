"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Post } from "@/types";
import { getBlogCopy } from "@/lib/blog-copy";
import { getLocalizedPost } from "@/lib/blog-post";

interface TagFilterProps {
  posts: Post[];
  onFilteredPostsChange: (filteredPosts: Post[]) => void;
}

export function TagFilter({ posts, onFilteredPostsChange }: TagFilterProps) {
  const { language } = useLanguage();
  const locale = language === "en" ? "en" : "pt";
  const copy = getBlogCopy(locale);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const callbackRef = useRef(onFilteredPostsChange);
  callbackRef.current = onFilteredPostsChange;

  const allTags = useMemo(() => Array.from(new Set(posts.flatMap((post) => getLocalizedPost(post, locale).tags))).sort(), [locale, posts]);
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts.filter((post) => {
      const localizedPost = getLocalizedPost(post, locale);
      const matchesTag = selectedTags.length === 0 || selectedTags.some((tag) => localizedPost.tags.includes(tag));
      if (!matchesTag) return false;
      if (!query) return true;
      return `${localizedPost.title} ${localizedPost.summary} ${localizedPost.tags.join(" ")}`.toLowerCase().includes(query);
    });
  }, [locale, posts, searchQuery, selectedTags]);

  useEffect(() => {
    callbackRef.current(filteredPosts);
  }, [filteredPosts]);

  if (allTags.length === 0 || posts.length < 2) return null;

  const hasFilters = selectedTags.length > 0 || searchQuery.trim().length > 0;
  const clearFilters = () => { setSelectedTags([]); setSearchQuery(""); };

  return (
    <div className="mb-8 rounded-2xl border border-border/70 bg-card/40 p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search} className="h-11 border-border/80 bg-background/50 pl-10" />
        </div>
        {hasFilters && <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="self-start text-muted-foreground hover:text-foreground lg:self-auto"><X className="h-4 w-4" aria-hidden="true" />{copy.clearFilters}</Button>}
      </div>
      <fieldset className="mt-5">
        <legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"><Filter className="h-4 w-4 text-gold" aria-hidden="true" />{copy.filterByTag}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const selected = selectedTags.includes(tag);
            return <button key={tag} type="button" aria-pressed={selected} onClick={() => setSelectedTags((current) => selected ? current.filter((item) => item !== tag) : [...current, tag])} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${selected ? "border-gold bg-gold text-slate-950" : "border-border/80 bg-secondary/60 text-muted-foreground hover:border-gold/50 hover:text-foreground"}`}>{tag}</button>;
          })}
        </div>
      </fieldset>
    </div>
  );
}
