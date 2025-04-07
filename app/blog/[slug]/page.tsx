import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { generatePageMetadata } from "@/components/seo/page-seo"
import type { Metadata } from "next"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  date: string
  author: {
    name: string
    avatar?: string
  }
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
}

type PageProps = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medium/posts`, {
      next: { revalidate: 3600 }, // Revalidar a cada hora
    })
    
    if (!response.ok) {
      return null
    }
    
    const posts = await response.json()
    return posts.find((post: any) => post.slug === slug) || null
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    return {
      title: "Post não encontrado | Caio Lombello",
      description: "O artigo solicitado não foi encontrado",
    }
  }
  
  return generatePageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    ogImage: post.coverImage,
    type: "article",
    publishedTime: post.date,
    tags: [...post.tags, "blog", "artigo"],
  })
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  
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
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
                {tag}
              </span>
            ))}
            <time className="text-sm text-muted-foreground">{formatDate(post.date)}</time>
          </div>

          <h1 className="mb-6 text-3xl font-bold text-gold md:text-4xl">{post.title}</h1>
        </div>

        {post.coverImage && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={post.coverImage}
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
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>
      </article>
    </div>
  )
} 