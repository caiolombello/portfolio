import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { loadPosts, loadPostBySlug } from "@/lib/data";
import { getDictionary } from "@/app/i18n/dictionaries";
import type { Lang } from "@/lib/i18n";
import BlogPostHeader from "@/components/blog/blog-post-header";
import PostNavigation from "@/components/blog/post-navigation";
import { getSiteConfig } from "@/lib/config-server";
import MarkdownRenderer from "@/components/blog/markdown-renderer";
import ReadingProgressBar from "@/components/blog/reading-progress-bar";
import PostLanguageHandler from "@/components/blog/post-language-handler";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await loadPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const lang: Lang = (post.slug_pt === slug ? "pt" : "en") as Lang;
  const dictionary = await getDictionary(lang);

  const posts = await loadPosts();
  const postIndex = posts.findIndex(
    (p) => (lang === "pt" ? p.slug_pt : p.slug_en) === slug
  );

  const previousPost = postIndex > 0 ? posts[postIndex - 1] : undefined;
  const nextPost =
    postIndex < posts.length - 1 ? posts[postIndex + 1] : undefined;
  const siteConfig = getSiteConfig();

  const content = lang === "en" ? post.body_en : post.body_pt;
  const title = lang === "en" ? post.title_en : post.title_pt;

  return (
    <>
      <ReadingProgressBar />
      <PostLanguageHandler slugEn={post.slug_en} slugPt={post.slug_pt} />
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
            {post.coverImage && (
              <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={post.coverImage}
                  alt={title!}
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
