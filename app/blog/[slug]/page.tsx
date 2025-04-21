import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/components/seo/page-seo";
import type { Metadata } from "next";
import { loadPostBySlug } from "@/lib/data";
import { BlogPostContent } from "@/components/blog/blog-post-content";
import { cookies } from "next/headers";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cookieStore = await cookies();
  const language = cookieStore.get("NEXT_LOCALE")?.value || "en";
  const post = await loadPostBySlug(slug);
  if (!post) return {};

  const title = language === "pt" ? post.title_pt : post.title_en;
  const description = language === "pt" ? post.summary_pt : post.summary_en;

  return generatePageMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    type: "article",
  });
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await loadPostBySlug(slug);
  if (!post) notFound();

  return <BlogPostContent post={post} />;
}
