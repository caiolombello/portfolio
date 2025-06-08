"use client";

import { Suspense, useEffect, useState } from "react";
import { BlogGrid } from "@/components/blog-grid";
import { TagFilter } from "@/components/blog/tag-filter";
import { BlogStats } from "@/components/blog/blog-stats";
import { PostSkeleton } from "@/components/ui/loading-skeleton";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Post } from "@/types";

function BlogContent({ posts }: { posts: Post[] }) {
  const { t } = useLanguage();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const postsPerPage = 9;
  const displayedPosts = filteredPosts.slice(0, postsPerPage);
  const hasMorePosts = filteredPosts.length > postsPerPage;

  // Atualizar posts filtrados quando posts mudam
  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  const handleFilteredPostsChange = (newFilteredPosts: Post[]) => {
    setFilteredPosts(newFilteredPosts);
  };

  const isFiltered = filteredPosts.length !== posts.length;

  return (
    <>
      <TagFilter 
        posts={posts} 
        onFilteredPostsChange={handleFilteredPostsChange}
      />
      
      <BlogStats
        totalPosts={posts.length}
        filteredPosts={filteredPosts.length}
        isFiltered={isFiltered}
      />
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-muted-foreground mb-2">
            {t("blog.noPostsWithFilters")}
          </h2>
          <p className="text-muted-foreground">
            {t("blog.tryDifferentFilters")}
          </p>
        </div>
      ) : (
        <>
          <BlogGrid posts={displayedPosts} />
          
          {hasMorePosts && (
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link href="/blog/page/2">
                  {t("blog.viewMore")}
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function BlogPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/public/posts");
        const { posts: postsData } = await response.json();
        setPosts(postsData || []);
      } catch (error) {
        console.error("Error loading posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container py-12">
      <h1 className="mb-12 text-center text-4xl font-bold">{t("blog.title")}</h1>
      
      {loading ? (
        <PostSkeleton />
      ) : (
        <BlogContent posts={posts} />
      )}
    </div>
  );
}
