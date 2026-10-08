import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { SiteLocale } from "@/lib/request-locale";
import Comments from "@/components/blog/comments";
import MarkdownRenderer from "@/components/blog/markdown-renderer";
import PostLanguageHandler from "@/components/blog/post-language-handler";
import ReadingProgressBar from "@/components/blog/reading-progress-bar";
import { ShareButtons } from "@/components/blog/share-buttons";
import { getSiteConfig } from "@/lib/config-server";
import { loadPostBySlug, loadPosts } from "@/lib/data";
import { getCopy } from "@/lib/locale/copy";
import { formatLongDate } from "@/lib/locale/format";
import { calculateReadingTime, getLocalizedPost } from "@/lib/blog-post";
import type { Post } from "@/types/blog";
import { buildBlogPostMetadata } from "@/lib/seo-metadata";
import { generateBlogPostJsonLd, generateJsonLd } from "@/lib/site-metadata";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function postLocale(post: Post, slug: string): SiteLocale {
  return post.slug_pt === slug ? "pt" : "en";
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const siteConfig = getSiteConfig();
  return buildBlogPostMetadata({ config: siteConfig, post, slug });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = (await loadPostBySlug(slug)) as Post | null;
  if (!post) notFound();

  const lang = postLocale(post, slug);
  const copy = getCopy(lang);
  const blogPath = getLocalizedInstitutionalPath("/blog", lang);
  const siteConfig = getSiteConfig();
  const posts = await loadPosts();
  const index = posts.findIndex(
    (item) => (lang === "pt" ? item.slug_pt : item.slug_en) === slug,
  );
  const newer = index > 0 ? posts[index - 1] : undefined;
  const older =
    index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined;

  const { title, summary, body: content, tags } = getLocalizedPost(post, lang);
  const author =
    typeof post.author === "string"
      ? post.author
      : (post.author?.name ?? siteConfig.site.author);
  const url = `${siteConfig.site.url}/blog/${slug}`;

  const structuredData = generateBlogPostJsonLd({
    title,
    description: summary,
    publishDate: post.publicationDate,
    updateDate: post.updatedAt,
    image: post.coverImage,
    url,
  });

  const neighbour = (
    item: Post | undefined,
    label: string,
    direction: "newer" | "older",
  ) => {
    if (!item) return <span />;
    const itemSlug = lang === "pt" ? item.slug_pt : item.slug_en;
    const itemTitle = getLocalizedPost(item, lang).title;
    return (
      <Link
        href={`/blog/${itemSlug}`}
        className={`group flex flex-col gap-2 rounded-2xl border bg-card p-5 transition-colors hover:border-foreground/20 ${
          direction === "older" ? "items-end text-right" : ""
        }`}
      >
        <span className="eyebrow inline-flex items-center gap-1.5">
          {direction === "newer" && (
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {label}
          {direction === "older" && (
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </span>
        <span className="font-semibold tracking-tight group-hover:text-brand">
          {itemTitle}
        </span>
      </Link>
    );
  };

  return (
    <>
      <ReadingProgressBar />
      <PostLanguageHandler slugEn={post.slug_en} slugPt={post.slug_pt} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd(structuredData)}
      />

      <article
        className="container max-w-3xl pb-8 pt-10 lg:pt-14"
        lang={lang === "pt" ? "pt-BR" : "en"}
      >
        <Link
          href={blogPath}
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          {copy.blog.back}
        </Link>

        <header className="mt-10">
          {tags.length > 0 && (
            <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-brand">
              {tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`${blogPath}?tag=${encodeURIComponent(tag.toLowerCase())}`}
                    className="hover:underline"
                  >
                    #{tag.toLowerCase()}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl">
            {title}
          </h1>
          {summary && (
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {summary}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-border/70 py-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2.5 font-medium text-foreground">
              <Image
                src={
                  typeof post.author === "object" && post.author.avatar
                    ? post.author.avatar
                    : "/api/profile-image"
                }
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-full border object-cover"
              />
              {author}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.publicationDate}>
              {formatLongDate(post.publicationDate, lang)}
            </time>
            <span aria-hidden="true">·</span>
            <span>
              {calculateReadingTime(content)} {copy.blog.readingTime}
            </span>
          </div>
        </header>

        {post.coverImage && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border">
            <Image
              src={post.coverImage}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-12">
          <MarkdownRenderer content={content} language={lang} />
        </div>

        <div className="mt-14 border-t border-border/70 pt-8">
          <ShareButtons title={title} url={url} language={lang} />
        </div>

        {(newer || older) && (
          <nav
            aria-label={copy.blog.title}
            className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {neighbour(newer, copy.blog.previous, "newer")}
            {neighbour(older, copy.blog.next, "older")}
          </nav>
        )}

        <Comments lang={lang} />
      </article>
    </>
  );
}
