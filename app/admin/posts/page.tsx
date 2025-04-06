"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    try {
      const response = await fetch("/api/admin/posts")
      if (!response.ok) throw new Error("Erro ao carregar posts")
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Erro ao carregar posts:", error)
      toast.error("Erro ao carregar posts")
    } finally {
      setLoading(false)
    }
  }

  async function savePost(post: Post) {
    setSaving(true)
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
      loadPosts()
    } catch (error) {
      console.error("Erro ao salvar post:", error)
      toast.error("Erro ao salvar post")
    } finally {
      setSaving(false)
    }
  }

  async function deletePost(id: string) {
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao deletar post")

      toast.success("Post deletado com sucesso!")
      loadPosts()
    } catch (error) {
      console.error("Erro ao deletar post:", error)
      toast.error("Erro ao deletar post")
    }
  }

  async function createPost() {
    const newPost: Post = {
      id: crypto.randomUUID(),
      title: "Novo Post",
      slug: "novo-post",
      description: "",
      content: "",
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    }

    setSaving(true)
    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      })

      if (!response.ok) throw new Error("Erro ao criar post")

      toast.success("Post criado com sucesso!")
      router.push(`/admin/posts/${newPost.id}`)
    } catch (error) {
      console.error("Erro ao criar post:", error)
      toast.error("Erro ao criar post")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            Gerencie os posts do seu blog.
          </p>
        </div>
        <Button onClick={createPost} disabled={saving}>
          {saving ? "Criando..." : "Novo Post"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                {post.published ? "Publicado" : "Rascunho"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Slug</Label>
                <Input
                  value={post.slug}
                  onChange={(e) =>
                    setPosts(
                      posts.map((p) =>
                        p.id === post.id ? { ...p, slug: e.target.value } : p
                      )
                    )
                  }
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={post.description}
                  onChange={(e) =>
                    setPosts(
                      posts.map((p) =>
                        p.id === post.id ? { ...p, description: e.target.value } : p
                      )
                    )
                  }
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/posts/${post.id}`)}
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => savePost(post)}
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deletePost(post.id)}
                >
                  Deletar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

