import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPostsData } from "@/lib/data";
import { generatePageMetadata } from "@/lib/site-metadata";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";
import BlogPageHeader from "@/components/blog/blog-page-header";
import { BlogGrid } from "@/components/blog-grid";
import { Button } from "@/components/ui/button";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";
import { parseBlogPage } from "@/lib/blog-pagination";

interface PageProps {
  params: Promise<{ page: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = parseBlogPage(page);
  const locale = await getCurrentRequestLocale();
  if (pageNumber === null || pageNumber < 2) {
    return generatePageMetadata({
      path: `/blog/page/${page}`,
      locale,
      title: locale === "pt" ? "Página não encontrada" : "Page not found",
      description: locale === "pt" ? "Esta página do blog não existe." : "This blog page does not exist.",
      noIndex: true,
    });
  }
  return generatePageMetadata({
    path: `/blog/page/${page}`,
    locale,
    title: locale === "pt" ? `Blog · Página ${page}` : `Blog · Page ${page}`,
    description:
      locale === "pt"
        ? "Mais artigos técnicos sobre Kubernetes, cloud, automação e confiabilidade."
        : "More technical articles about Kubernetes, cloud, automation, and reliability.",
  });
}

export default async function BlogPaginationPage({ params }: PageProps) {
  const { page } = await params;
  const pageNumber = parseBlogPage(page);
  const posts = await getPostsData();
  const language = await getCurrentRequestLocale();
  const perPage = 9;
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));

  if (pageNumber === null || pageNumber < 2 || pageNumber > totalPages) notFound();

  const paginatedPosts = posts.slice((pageNumber - 1) * perPage, pageNumber * perPage);

  return (
    <div className="container py-16 sm:py-20">
      <BlogPageHeader />
      <BlogGrid posts={paginatedPosts} />
      <nav className="mt-10 flex items-center justify-between border-t border-border/70 pt-6" aria-label={language === "en" ? "Pagination" : "Paginação"}>
        <Button asChild variant="outline"><Link href={getLocalizedInstitutionalPath(pageNumber === 2 ? "/blog" : `/blog/page/${pageNumber - 1}`, language)}>{language === "en" ? "Previous" : "Anterior"}</Link></Button>
        {pageNumber < totalPages && <Button asChild variant="outline"><Link href={getLocalizedInstitutionalPath(`/blog/page/${pageNumber + 1}`, language)}>{language === "en" ? "Next" : "Próximo"}</Link></Button>}
      </nav>
    </div>
  );
}
