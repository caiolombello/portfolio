import { notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { marked } from "marked"

export default async function BlogPostPage({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = params
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
    return new Date(dateString).toLocaleDateString(lang === "en" ? "en-US" : "pt-BR", options)
  }

  return (
    <div className="container py-12">
      <Link href={`/${lang}/blog`} className="mb-8 inline-flex items-center text-muted-foreground hover:text-gold">
        <ArrowLeft size={16} className="mr-2" />
        {lang === "en" ? "Back to blog" : "Voltar para o blog"}
      </Link>

      <article className="mx-auto max-w-3xl">
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            {post.tags && post.tags.length > 0 && post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
                {tag}
              </span>
            ))}
            <time className="text-sm text-muted-foreground">{formatDate(post.date)}</time>
          </div>

          <h1 className="mb-6 text-3xl font-bold text-gold md:text-4xl">{lang === "en" ? post.title_en : post.title_pt}</h1>
        </div>

        {post.coverImage && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={post.coverImage}
              alt={lang === "en" ? post.title_en : post.title_pt}
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
              dangerouslySetInnerHTML={{ __html: marked.parse(lang === "en" ? post.body_en : post.body_pt) }}
            />
          </CardContent>
        </Card>
      </article>
    </div>
  )
} 