import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { loadPosts, loadPostBySlug } from "@/lib/data";
import type { Lang } from "@/lib/i18n";
import BlogPostHeader from "@/components/blog/blog-post-header";
import PostNavigation from "@/components/blog/post-navigation";
import { getSiteConfig } from "@/lib/config-server";
import { generateBlogPostJsonLd, generateJsonLd } from "@/lib/site-metadata";
import { buildBlogPostMetadata } from "@/lib/seo-metadata";
import MarkdownRenderer from "@/components/blog/markdown-renderer";
import ReadingProgressBar from "@/components/blog/reading-progress-bar";
import PostLanguageHandler from "@/components/blog/post-language-handler";
import Comments from "@/components/blog/comments";
import { getBlogCopy } from "@/lib/blog-copy";
import { getLocalizedPost } from "@/lib/blog-post";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
  const post = await loadPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const lang: Lang = (post.slug_pt === slug ? "pt" : "en") as Lang;
  const copy = getBlogCopy(lang === "en" ? "en" : "pt");

  const posts = await loadPosts();
  const postIndex = posts.findIndex(
    (p) => (lang === "pt" ? p.slug_pt : p.slug_en) === slug
  );

  const previousPost = postIndex > 0 ? posts[postIndex - 1] : undefined;
  const nextPost =
    postIndex < posts.length - 1 ? posts[postIndex + 1] : undefined;
  const siteConfig = getSiteConfig();

  const localizedPost = getLocalizedPost(post, lang === "en" ? "en" : "pt");
  const { body: content, summary, title } = localizedPost;
  const postUrl = `${siteConfig.site.url}/blog/${slug}`;

  return (
    <>
      <ReadingProgressBar />
      <PostLanguageHandler slugEn={post.slug_en} slugPt={post.slug_pt} />
      <div className="container py-8 sm:py-16">
        <Link
          href={lang === "en" ? "/en/blog" : "/blog"}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft size={16} className="mr-2" />
          {copy.back}
        </Link>
        <article className="mx-auto mt-8 max-w-5xl sm:mt-10">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={generateJsonLd(
                generateBlogPostJsonLd({
                  title: title || "",
                  description: summary,
                  publishDate: post.publicationDate,
                  updateDate: post.updatedAt,
                  image: post.coverImage,
                  url: postUrl,
                }),
              )}
            />
            <BlogPostHeader
              post={post}
              lang={lang === "en" ? "en" : "pt"}
              siteUrl={siteConfig.site.url}
            />
            {post.coverImage && (
              <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/80 bg-secondary sm:mb-10 sm:aspect-[16/8]">
                <Image
                  src={post.coverImage}
                  alt={title!}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <Card className="rounded-2xl border-border/80 bg-card/50 shadow-none">
              <CardContent className="px-5 py-7 sm:px-10 sm:py-12">
                <MarkdownRenderer content={content ?? ""} language={lang === "en" ? "en" : "pt"} />
              </CardContent>
            </Card>
            <PostNavigation
              previousPost={previousPost}
              nextPost={nextPost}
              lang={lang === "en" ? "en" : "pt"}
            />
            <Comments lang={lang === "en" ? "en" : "pt"} />
        </article>
      </div>
    </>
  );
}
