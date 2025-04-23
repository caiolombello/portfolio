"use client";

import { notFound } from "next/navigation";
import { BlogGrid } from "@/components/blog-grid";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useLanguage } from "@/contexts/language-context";
import { useState, useEffect, Suspense } from "react";
import { BlogGridSkeleton } from "@/components/loading-skeleton";
import type { Post } from "@/types";

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

function BlogContent({
  posts,
  pageNumber,
  totalPages,
}: {
  posts: Post[];
  pageNumber: number;
  totalPages: number;
}) {
  const { t } = useLanguage();

  return (
    <>
      <BlogGrid posts={posts} />

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {pageNumber > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`/blog/page/${pageNumber - 1}`}>
                  {t("blog.pagination.previous")}
                </PaginationPrevious>
              </PaginationItem>
            )}

            {pageNumber < totalPages && (
              <PaginationItem>
                <PaginationNext href={`/blog/page/${pageNumber + 1}`}>
                  {t("blog.pagination.next")}
                </PaginationNext>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

export default function BlogPage({ params }: PageProps) {
  const [pageNumber, setPageNumber] = useState<number | null>(null);
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPage = async () => {
      const { page } = await params;
      const num = parseInt(page, 10);
      if (isNaN(num) || num < 1) {
        notFound();
      }
      setPageNumber(num);
    };
    initPage();
  }, [params]);

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

  if (pageNumber === null) {
    return <BlogGridSkeleton />;
  }

  if (!loading && posts.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">{t("blog.title")}</h1>
        <p className="text-center text-gray-500">
          {t("blog.noPosts")}
        </p>
      </div>
    );
  }

  const postsPerPage = 9;
  const start = (pageNumber - 1) * postsPerPage;
  const end = start + postsPerPage;
  const paginatedPosts = posts.slice(start, end);

  if (!loading && paginatedPosts.length === 0) {
    notFound();
  }

  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">{t("blog.title")}</h1>

      <Suspense fallback={<BlogGridSkeleton />}>
        {!loading && (
          <BlogContent
            posts={paginatedPosts}
            pageNumber={pageNumber}
            totalPages={totalPages}
          />
        )}
      </Suspense>
    </div>
  );
}
