import { getPostsData } from "@/lib/data";
import BlogBrowser from "@/components/blog/blog-browser";
import BlogPageHeader from "@/components/blog/blog-page-header";
import { generatePageMetadata } from "@/lib/site-metadata";
import { getCurrentRequestLocale } from "@/lib/request-locale-server";
import type { Metadata } from "next";

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

export default async function BlogPage() {
  const posts = await getPostsData();

  return (
    <div className="container py-16 sm:py-20">
      <BlogPageHeader />
      <BlogBrowser posts={posts} />
    </div>
  );
}
