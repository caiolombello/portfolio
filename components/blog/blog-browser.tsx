"use client";

import { useCallback, useEffect, useState } from "react";
import type { Post } from "@/types";
import { useLanguage } from "@/contexts/language-context";
import { TagFilter } from "@/components/blog/tag-filter";
import { BlogStats } from "@/components/blog/blog-stats";
import { BlogGrid } from "@/components/blog-grid";
import { Button } from "@/components/ui/button";
import { getBlogCopy } from "@/lib/blog-copy";

interface BlogBrowserProps {
  posts: Post[];
}

export default function BlogBrowser({ posts }: BlogBrowserProps) {
  const { language } = useLanguage();
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const postsPerPage = 9;
  const [visibleCount, setVisibleCount] = useState(postsPerPage);
  const copy = getBlogCopy(language === "en" ? "en" : "pt");

  useEffect(() => {
    setFilteredPosts(posts);
    setVisibleCount(postsPerPage);
  }, [posts]);
  const handleFilteredPostsChange = useCallback((nextPosts: Post[]) => {
    setFilteredPosts(nextPosts);
    setVisibleCount(postsPerPage);
  }, []);

  return (
    <>
      <TagFilter posts={posts} onFilteredPostsChange={handleFilteredPostsChange} />
      <BlogStats totalPosts={posts.length} filteredPosts={filteredPosts.length} isFiltered={filteredPosts.length !== posts.length} />
      <BlogGrid
        posts={filteredPosts.slice(0, visibleCount)}
        emptyMessage={posts.length === 0 ? copy.empty : copy.noResults}
      />
      {filteredPosts.length > visibleCount && (
        <div className="mt-10 text-center">
          <Button type="button" variant="outline" onClick={() => setVisibleCount((count) => count + postsPerPage)}>{copy.showMore}</Button>
        </div>
      )}
    </>
  );
}
