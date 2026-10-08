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
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentRequestLocale();
  return generatePageMetadata({
    path: "/blog",
    locale,
    title: locale === "pt" ? "Blog técnico" : "Technical blog",
    description:
      locale === "pt"
        ? "Artigos práticos sobre Kubernetes, observabilidade, automação, confiabilidade e operação de plataformas cloud."
        : "Practical articles about Kubernetes, observability, automation, reliability, and cloud platform operations.",
  });
}

interface BlogPageProps {
  searchParams: Promise<{ tag?: string | string[] }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
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
            <PostList locale={locale} posts={visible.slice(0, 9)} />
          ) : (
            <p className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
              {copy.blog.empty}
            </p>
          )}
        </div>
        {visible.length > 9 && (
          <nav
            className="mt-10 flex justify-end border-t border-border/70 pt-6"
            aria-label={locale === "en" ? "Pagination" : "Paginação"}
          >
            <Link
              href={`${getLocalizedInstitutionalPath("/blog/page/2", locale)}${active ? `?tag=${encodeURIComponent(active)}` : ""}`}
              className="rounded-full border border-border/80 px-4 py-2 text-sm font-medium transition-colors hover:border-foreground/25"
            >
              {locale === "en" ? "Next" : "Próximo"}
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
