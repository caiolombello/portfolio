import { posts } from "@/data/posts"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { generatePageMetadata } from "@/components/seo/page-seo"
import type { Metadata } from "next"

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = posts.find((p) => p.id === id)

  if (!post) {
    return {
      title: "Post não encontrado | Caio Lombello",
      description: "O artigo solicitado não foi encontrado",
    }
  }

  return generatePageMetadata({
    title: post.title,
    description: post.summary,
    path: `/blog/${post.id}`,
    ogImage: post.imageUrl,
    type: "article",
    publishedTime: post.publicationDate,
    tags: [post.category, "blog", "artigo"],
  })
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id)

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
            <span className="rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">{post.category}</span>
            <time className="text-sm text-muted-foreground">{formatDate(post.publicationDate)}</time>
          </div>

          <h1 className="mb-6 text-3xl font-bold text-gold md:text-4xl">{post.title}</h1>
        </div>

        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
          <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
        </div>

        <div className="prose prose-invert max-w-none prose-headings:text-gold prose-a:text-gold">
          <p className="lead">{post.summary}</p>

          <p>
            Este é um placeholder para o conteúdo completo do artigo. Em um blog real, aqui seria exibido o texto
            completo do post, formatado com Markdown ou HTML.
          </p>

          <h2>Introdução</h2>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc
            nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl
            aliquet nunc, quis aliquam nisl nunc quis nisl.
          </p>

          <h2>Desenvolvimento</h2>

          <p>
            Suspendisse potenti. Sed euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl
            nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc
            quis nisl.
          </p>

          <pre>
            <code>{`
# Exemplo de código
function example() {
console.log("Hello, world!");
}
        `}</code>
          </pre>

          <h2>Conclusão</h2>

          <p>
            Cras mattis consectetur purus sit amet fermentum. Nullam quis risus eget urna mollis ornare vel eu leo.
            Nullam id dolor id nibh ultricies vehicula ut id elit. Nullam quis risus eget urna mollis ornare vel eu leo.
          </p>
        </div>
      </article>
    </div>
  )
}

