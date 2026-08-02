import { loadPostBySlug } from "@/lib/data";
import { createOgImage } from "@/lib/og-image";

export const alt = "Caio Barbieri technical blog article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = await loadPostBySlug(slug);

  if (!post) {
    return createOgImage({
      eyebrow: "Blog",
      title: "Artigo não encontrado.",
      path: `/blog/${slug}`,
    });
  }

  const isPortuguese = post.slug_pt === slug;
  return createOgImage({
    eyebrow: isPortuguese ? "Artigo · Plataforma" : "Article · Platform",
    title: isPortuguese ? post.title_pt : post.title_en,
    description: isPortuguese ? post.summary_pt : post.summary_en,
    tags: isPortuguese ? post.tags_pt : post.tags_en,
    path: `/blog/${slug}`,
  });
}
