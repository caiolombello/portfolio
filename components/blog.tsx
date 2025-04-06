"use client"

import { useState, useEffect } from "react"
import PostCard from "./post-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

export default function Blog() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const POSTS_PER_PAGE = 3

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/public/posts")
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error("Erro ao carregar posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Ordenar posts por data (mais recentes primeiro)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime(),
  )

  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE)

  // Obter posts para a página atual
  const currentPosts = sortedPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setIsLoading(true)
    setCurrentPage(page)

    // Rolar para o topo da lista de posts
    window.scrollTo({
      top: document.getElementById("blog-posts")?.offsetTop || 0,
      behavior: "smooth",
    })

    // Simular carregamento
    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }

  if (loading) {
    return (
      <div className="container py-12">
        <h1 className="mb-12 text-center text-4xl font-bold text-gold">Blog</h1>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-gold rounded-full border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="container py-12">
        <h1 className="mb-12 text-center text-4xl font-bold text-gold">Blog</h1>
        <div className="text-center text-muted-foreground">
          <p>Nenhum post encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <h1 className="mb-12 text-center text-4xl font-bold text-gold">Blog</h1>

      <div id="blog-posts" className="space-y-8 mb-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : (
          currentPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            aria-label="Página anterior"
            className="transition-transform hover:scale-105 duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(index + 1)}
              disabled={isLoading}
              aria-label={`Página ${index + 1}`}
              aria-current={currentPage === index + 1 ? "page" : undefined}
              className="transition-transform hover:scale-105 duration-200"
            >
              {index + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            aria-label="Próxima página"
            className="transition-transform hover:scale-105 duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

