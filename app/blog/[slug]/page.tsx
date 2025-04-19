import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { generatePageMetadata } from "@/components/seo/page-seo"
import type { Metadata } from "next"
import { getPostBySlug, BlogPost } from "@/lib/data"
import { marked } from "marked"

type PageProps = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    return {
      title: "Post não encontrado | Caio Lombello",
      description: "O artigo solicitado não foi encontrado",
    }
  }
  
  return generatePageMetadata({
    title: post.title,
    description: post.summary,
    path: `/blog/${post.slug}`,
    ogImage: post.imageUrl,
    type: "article",
    publishedTime: post.publicationDate,
    tags: [post.category, "blog", "artigo"],
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  // Formatar a data para exibição
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("pt-BR", options)
  }
  
  return (
    <div className="container py-12">
      <Link href="/blog" className="mb-8 inline-flex items-center text-muted-foreground hover:text-gold">
        <ArrowLeft size={16} className="mr-2" />
        Voltar para o blog
      </Link>

      <article className="mx-auto max-w-3xl">
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            {post.category && (
              <span className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
                {post.category}
              </span>
            )}
            <time className="text-sm text-muted-foreground">{formatDate(post.publicationDate)}</time>
          </div>

          <h1 className="mb-6 text-3xl font-bold text-gold md:text-4xl">{post.title}</h1>
        </div>

        {post.imageUrl && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <Card>
          <CardContent className="pt-6">
            <div 
              className="prose prose-invert max-w-none prose-headings:text-gold prose-a:text-gold"
              dangerouslySetInnerHTML={{ __html: marked.parse(post.content) }}
            />
          </CardContent>
        </Card>
      </article>
    </div>
  )
} 