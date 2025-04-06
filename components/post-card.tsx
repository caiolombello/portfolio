import Image from "next/image"
import Link from "next/link"
import type { Post } from "@/data/posts"

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
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
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border/40 bg-card transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10 md:flex-row">
      <div className="relative h-48 w-full md:h-auto md:w-1/3">
        <Image
          src={post.imageUrl || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="mb-4">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">{post.category}</span>
            <time className="text-xs text-muted-foreground">{formatDate(post.publicationDate)}</time>
          </div>

          <Link href={`/blog/${post.id}`}>
            <h3 className="mb-3 text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-gold">
              {post.title}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground">{post.summary}</p>
        </div>

        <Link
          href={`/blog/${post.id}`}
          className="inline-flex items-center text-sm font-medium text-gold hover:underline transition-all duration-200"
        >
          Ler mais
        </Link>
      </div>
    </article>
  )
}

