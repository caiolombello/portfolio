import { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadPosts } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getDictionary } from "@/app/i18n/dictionaries";
import { generateSeoMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/i18n";
import BlogPostHeader from "@/components/blog/blog-post-header";
import PostNavigation from "@/components/blog/post-navigation";
import { getSiteConfig } from "@/lib/config-server";
import MarkdownRenderer from "@/components/blog/markdown-renderer";
import ReadingProgressBar from "@/components/blog/reading-progress-bar";

interface PageProps {
  params: Promise<{
    lang: Lang;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const dictionary = await getDictionary(lang);
  const posts = await loadPosts();
  const post = posts.find((p) => p.slug_pt === slug || p.slug_en === slug);

  if (!post) {
    return {
      title: dictionary.blog.notFound.title,
      description: dictionary.blog.notFound.description,
    };
  }

  return generateSeoMetadata({
    title: lang === "en" ? post.title_en : post.title_pt,
    description: lang === "en" ? post.summary_en : post.summary_pt,
    ogImage: post.coverImage ?? "",
    ogType: "article",
    twitterCard: "summary_large_image",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const dictionary = await getDictionary(lang);
  const posts = await loadPosts();
  const post = posts.find((p) => p.slug_pt === slug || p.slug_en === slug);

  if (!post) {
    notFound();
  }

  const postIndex = posts.findIndex(
    (p) => p.slug_pt === slug || p.slug_en === slug,
  );
  const previousPost = postIndex > 0 ? posts[postIndex - 1] : undefined;
  const nextPost =
    postIndex < posts.length - 1 ? posts[postIndex + 1] : undefined;
  const siteConfig = getSiteConfig();

  const content = lang === "en" ? post.body_en : post.body_pt;
  const title = lang === "en" ? post.title_en : post.title_pt;
  const summary = lang === "en" ? post.summary_en : post.summary_pt;

  return (
    <>
      <ReadingProgressBar />
      <div className="container py-12">
        <Link
          href={`/blog`}
          className="mb-8 inline-flex items-center text-muted-foreground hover:text-gold"
        >
          <ArrowLeft size={16} className="mr-2" />
          {dictionary.blog.back}
        </Link>
        <main>
          <article>
            <BlogPostHeader
              post={post}
              dictionary={dictionary}
              lang={lang}
              siteUrl={siteConfig.site.url}
            />

            {/* Dados estruturados Schema.org para BlogPosting */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "BlogPosting",
                  headline: title,
                  description: summary,
                  image: post.coverImage ?? "",
                  author: {
                    "@type": "Person",
                    name: post.author?.name ?? "Caio Barbieri",
                    url: siteConfig.site.url,
                  },
                  publisher: {
                    "@type": "Organization",
                    name: post.author?.name ?? "Caio Barbieri",
                    logo: {
                      "@type": "ImageObject",
                      url: `${siteConfig.site.url}/icon.png`,
                    },
                  },
                  datePublished: post.publicationDate,
                  dateModified: post.publicationDate,
                  mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": `${siteConfig.site.url}/blog/${
                      lang === "en" ? post.slug_en : post.slug_pt
                    }`,
                  },
                }),
              }}
            />

            {post.coverImage && (
              <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={post.coverImage}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <Card>
              <CardContent className="pt-6">
                <MarkdownRenderer content={content ?? ""} />
              </CardContent>
            </Card>

            <PostNavigation
              previousPost={previousPost}
              nextPost={nextPost}
              dictionary={dictionary}
              lang={lang}
            />
          </article>
        </main>
      </div>
    </>
  );
}
