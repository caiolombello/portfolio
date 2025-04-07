"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Switch } from "@/components/ui/switch"
import { Metadata } from 'next'
import { getDictionary } from '@/app/i18n/dictionaries'

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

interface Post {
  id: string
  title: string
  slug: string
  description: string
  content: string
  published: boolean
  createdAt: string
  updatedAt: string
  tags: string[]
}

type PageProps = {
  params: Promise<{ id: string }>
}

export default function EditPostPage({ params }: PageProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadPost = async () => {
      try {
        const { id } = await params
        const response = await fetch(`/api/admin/posts/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch post')
        }
        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [params])

  async function savePost() {
    if (!post) return

    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      })

      if (!response.ok) throw new Error("Erro ao salvar post")

      toast.success("Post salvo com sucesso!")
      router.push("/admin/posts")
    } catch (error) {
      console.error("Erro ao salvar post:", error)
      toast.error("Erro ao salvar post")
    }
  }

  async function deletePost() {
    if (!post) return

    if (!confirm("Tem certeza que deseja deletar este post?")) return

    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao deletar post")

      toast.success("Post deletado com sucesso!")
      router.push("/admin/posts")
    } catch (error) {
      console.error("Erro ao deletar post:", error)
      toast.error("Erro ao deletar post")
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!post) return <div>Post not found</div>

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Editar Post</h1>
          <p className="text-muted-foreground">
            Edite o conteúdo do seu post.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={post.published}
            onCheckedChange={(checked) => {
              setPost((prev) => prev ? { ...prev, published: checked } : null)
            }}
          />
          <span className="text-sm text-muted-foreground">
            {post.published ? 'Publicado' : 'Rascunho'}
          </span>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={post.title}
            onChange={(e) => setPost((prev) => prev ? { ...prev, title: e.target.value } : null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={post.slug}
            onChange={(e) => setPost((prev) => prev ? { ...prev, slug: e.target.value } : null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            value={post.description}
            onChange={(e) => setPost((prev) => prev ? { ...prev, description: e.target.value } : null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Conteúdo
          </label>
          <MDEditor
            value={post.content}
            onChange={(value) => setPost((prev) => prev ? { ...prev, content: value || '' } : null)}
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={post.tags.join(', ')}
            onChange={(e) => setPost((prev) => prev ? { ...prev, tags: e.target.value.split(',').map((tag) => tag.trim()) } : null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-8 space-x-2">
        <Button variant="outline" onClick={() => router.push("/admin/posts")}>
          Voltar
        </Button>
        <Button onClick={savePost}>Salvar</Button>
        <Button variant="destructive" onClick={deletePost}>
          Deletar
        </Button>
      </div>
    </div>
  )
} 