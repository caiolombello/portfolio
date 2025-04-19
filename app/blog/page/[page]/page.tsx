import { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogPost } from "@/lib/data"
import { BlogGrid } from "@/components/blog-grid"
import { getAllPosts } from "@/lib/data"

type PageProps = {
  params: Promise<{
    page: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params
  return {
    title: `Blog - Página ${page}`,
  }
}

export default async function BlogPage({ params }: PageProps) {
  const { page } = await params
  const pageNum = parseInt(page)
  if (isNaN(pageNum) || pageNum < 1) {
    notFound()
  }

  const posts: BlogPost[] = getAllPosts()
  const itemsPerPage = 9
  const startIndex = (pageNum - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPosts = posts.slice(startIndex, endIndex)

  if (paginatedPosts.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <BlogGrid posts={paginatedPosts.map(post => ({
        ...post,
        slug: post.slug ?? post.id,
        excerpt: post.excerpt ?? post.summary ?? "",
        title: post.title ?? "",
        summary: post.summary ?? "",
        content: post.content ?? "",
        author: post.author ?? { name: "", avatar: "" },
      }))} />
    </div>
  )
} 