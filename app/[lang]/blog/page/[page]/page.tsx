import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogGrid } from "@/components/blog-grid";
import { getPosts } from "@/lib/cms/posts";
import { getDictionary } from "@/app/i18n/dictionaries";
import type { Lang } from "@/lib/i18n";
import { BlogGridSkeleton } from "@/components/loading-skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PageProps {
  params: Promise<{
    lang: Lang;
    page: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, page } = await params;
  const dictionary = await getDictionary(lang);
  return {
    title: `${dictionary.blog.title} - ${dictionary.blog.pagination.page} ${page}`,
    description: dictionary.blog.description,
  };
}

async function BlogContent({ lang, page }: { lang: Lang; page: string }) {
  const dictionary = await getDictionary(lang);
  const posts = await getPosts();
  const pageNumber = parseInt(page, 10);
  const postsPerPage = 9;
  const start = (pageNumber - 1) * postsPerPage;
  const end = start + postsPerPage;
  const paginatedPosts = posts.slice(start, end);

  if (paginatedPosts.length === 0) {
    notFound();
  }

  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <>
      <BlogGrid posts={paginatedPosts} />

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {pageNumber > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`/${lang}/blog/page/${pageNumber - 1}`}
                >
                  {dictionary.blog.pagination.previous}
                </PaginationPrevious>
              </PaginationItem>
            )}

            {[...Array(totalPages)].map((_, idx) => {
              const currentPage = idx + 1;
              if (
                currentPage === 1 ||
                currentPage === totalPages ||
                Math.abs(currentPage - pageNumber) <= 1
              ) {
                return (
                  <PaginationItem key={currentPage}>
                    <PaginationLink
                      href={`/${lang}/blog/page/${currentPage}`}
                      isActive={currentPage === pageNumber}
                    >
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              if (
                (currentPage === 2 && pageNumber > 3) ||
                (currentPage === totalPages - 1 && pageNumber < totalPages - 2)
              ) {
                return (
                  <PaginationItem key={currentPage + "-ellipsis"}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}

            {pageNumber < totalPages && (
              <PaginationItem>
                <PaginationNext href={`/${lang}/blog/page/${pageNumber + 1}`}>
                  {dictionary.blog.pagination.next}
                </PaginationNext>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

export default async function BlogPage({ params }: PageProps) {
  const { lang, page } = await params;
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<BlogGridSkeleton />}>
        <BlogContent lang={lang} page={page} />
      </Suspense>
    </div>
  );
}
