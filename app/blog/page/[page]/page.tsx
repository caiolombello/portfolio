import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBlob } from "@/lib/blob-storage"
import { BlogPost } from "@/types/blog"
import { BlogGrid } from "@/components/blog-grid"

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

  const postsData = await getBlob("blog.json")
  if (!postsData) {
    return <div>Nenhum post encontrado</div>
  }

  const posts: BlogPost[] = JSON.parse(postsData)
  const itemsPerPage = 9
  const startIndex = (pageNum - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPosts = posts.slice(startIndex, endIndex)

  if (paginatedPosts.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <BlogGrid posts={paginatedPosts} />
    </div>
  )
} 