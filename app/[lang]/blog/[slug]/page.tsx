import { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadPosts } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { marked } from "marked";
import { getDictionary } from "@/app/i18n/dictionaries";
import { generateSeoMetadata } from "@/lib/seo";
import type { Lang } from "@/lib/i18n";

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  const content = lang === "en" ? post.body_en : post.body_pt;
  const title = lang === "en" ? post.title_en : post.title_pt;
  const summary = lang === "en" ? post.summary_en : post.summary_pt;
  const dateFromSlug = slug.split("-").slice(0, 3).join("-");
  const parsedContent = await marked.parse(content ?? "");

  return (
    <div className="container py-12">
      <Link
        href={`/${lang}/blog`}
        className="mb-8 inline-flex items-center text-muted-foreground hover:text-gold"
      >
        <ArrowLeft size={16} className="mr-2" />
        {dictionary.blog.back}
      </Link>

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
            author: { "@type": "Person", name: post.author?.name ?? "" },
            datePublished: dateFromSlug,
            dateModified: dateFromSlug,
            url: `https://caio.lombello.com/${lang}/blog/${dateFromSlug}`,
          }),
        }}
      />

      <article className="mx-auto max-w-3xl">
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            {post.tags &&
              post.tags.length > 0 &&
              post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            <time
              className="text-sm text-muted-foreground"
              dateTime={dateFromSlug}
            >
              {dictionary.blog.publishedOn} {formatDate(dateFromSlug)}
            </time>
          </div>

          <h1 className="mb-6 text-3xl font-bold text-gold md:text-4xl">
            {title}
          </h1>

          <p className="text-lg text-muted-foreground">{summary}</p>
        </div>

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
            <div
              className="prose prose-invert max-w-none prose-headings:text-gold prose-a:text-gold prose-pre:bg-secondary"
              dangerouslySetInnerHTML={{
                __html: parsedContent,
              }}
            />
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
