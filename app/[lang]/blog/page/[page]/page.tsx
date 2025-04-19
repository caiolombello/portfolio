import { notFound } from "next/navigation"
import { getAllPosts } from "@/lib/data"

export default async function BlogPage({ params }: { params: { lang: string; page: string } }) {
  const { lang, page } = params
  const pageNum = parseInt(page)
  if (isNaN(pageNum) || pageNum < 1) {
    notFound()
  }

  const posts = getAllPosts()
  const itemsPerPage = 9
  const startIndex = (pageNum - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPosts = posts.slice(startIndex, endIndex)

  if (paginatedPosts.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      {paginatedPosts.map(post => (
        <div key={post.id}>
          <h2>{lang === "en" ? post.title_en : post.title_pt}</h2>
          <p>{lang === "en" ? post.summary_en : post.summary_pt}</p>
        </div>
      ))}
    </div>
  )
} 