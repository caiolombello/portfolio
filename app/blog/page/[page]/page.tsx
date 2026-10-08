import type { Metadata } from "next";
import Link from "next/link";
import { Rss } from "lucide-react";
import { PostList } from "@/components/site/post-list";
import { SectionHeader } from "@/components/site/section-header";
import { getCopy } from "@/lib/locale/copy";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";
import { getPosts } from "@/lib/site-data";
import { generatePageMetadata } from "@/lib/site-metadata";
import { notFound } from "next/navigation";
import { parseBlogPage } from "@/lib/blog-pagination";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = parseBlogPage(page);
  const locale = await getCurrentRequestLocale();
  if (pageNumber === null || pageNumber < 2) {
    return generatePageMetadata({
      path: `/blog/page/${page}`,
      locale,
      title: locale === "pt" ? "Página não encontrada" : "Page not found",
      description:
        locale === "pt"
          ? "Esta página do blog não existe."
          : "This blog page does not exist.",
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

interface PageProps {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ tag?: string | string[] }>;
}

export default async function BlogPaginationPage({
  params,
  searchParams,
}: PageProps) {
  const { page } = await params;
  const pageNumber = parseBlogPage(page);
  const { tag } = await searchParams;
  const locale = await getCurrentRequestLocale();
  const copy = getCopy(locale);
  const blogPath = getLocalizedInstitutionalPath("/blog", locale);
  const posts = await getPosts(locale);

  const counts = new Map<string, { label: string; count: number }>();
  for (const post of posts) {
    for (const label of post.tags) {
      const key = label.toLowerCase();
      counts.set(key, { label, count: (counts.get(key)?.count ?? 0) + 1 });
    }
  }
  const tags = Array.from(counts.entries()).sort(
    (a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]),
  );
  const requested = (Array.isArray(tag) ? tag[0] : tag)?.toLowerCase();
  const active = requested && counts.has(requested) ? requested : undefined;
  const visible = active
    ? posts.filter((post) =>
        post.tags.some((label) => label.toLowerCase() === active),
      )
    : posts;

  const totalPages = Math.max(1, Math.ceil(visible.length / 9));
  if (pageNumber === null || pageNumber < 2 || pageNumber > totalPages)
    notFound();
  const query = active ? `?tag=${encodeURIComponent(active)}` : "";

  const chip = (selected: boolean) =>
    cn(
      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors",
      selected
        ? "border-foreground bg-foreground text-background"
        : "border-border/80 bg-card/60 text-muted-foreground hover:border-foreground/25 hover:text-foreground",
    );

  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="bg-grid mask-radial-top pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem]"
      />

      <div className="container pb-8 pt-12 lg:pt-20">
        <SectionHeader
          as="h1"
          eyebrow={copy.blog.title}
          title={copy.sections.blog.title}
          description={copy.blog.description}
          action={
            <a
              href="/feed.xml"
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/25"
            >
              <Rss className="h-4 w-4 text-brand" aria-hidden="true" />
              RSS
            </a>
          }
        />

        {tags.length > 0 && (
          <nav aria-label={copy.blog.filterLabel} className="mt-10">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link
                  href={blogPath}
                  scroll={false}
                  aria-current={!active ? "page" : undefined}
                  className={chip(!active)}
                >
                  {copy.blog.all}
                </Link>
              </li>
              {tags.map(([key, { label, count }]) => (
                <li key={key}>
                  <Link
                    href={`${blogPath}?tag=${encodeURIComponent(key)}`}
                    scroll={false}
                    aria-current={active === key ? "page" : undefined}
                    className={chip(active === key)}
                  >
                    #{label.toLowerCase()}
                    <span className="opacity-60">{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="mt-10">
          {visible.length > 0 ? (
            <PostList
              locale={locale}
              posts={visible.slice((pageNumber - 1) * 9, pageNumber * 9)}
            />
          ) : (
            <p className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
              {copy.blog.empty}
            </p>
          )}
        </div>
        <nav
          className="mt-10 flex items-center justify-between border-t border-border/70 pt-6"
          aria-label={locale === "en" ? "Pagination" : "Paginação"}
        >
          <Link
            href={`${getLocalizedInstitutionalPath(pageNumber === 2 ? "/blog" : `/blog/page/${pageNumber - 1}`, locale)}${query}`}
            className="rounded-full border border-border/80 px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/25"
          >
            {locale === "en" ? "Previous" : "Anterior"}
          </Link>
          {pageNumber < totalPages && (
            <Link
              href={`${getLocalizedInstitutionalPath(`/blog/page/${pageNumber + 1}`, locale)}${query}`}
              className="rounded-full border border-border/80 px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/25"
            >
              {locale === "en" ? "Next" : "Próximo"}
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
