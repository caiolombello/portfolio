"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Switch } from "@/components/ui/switch"

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

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadPost()
  }, [params.id])

  async function loadPost() {
    try {
      const response = await fetch(`/api/admin/posts/${params.id}`)
      if (!response.ok) throw new Error("Erro ao carregar post")
      const data = await response.json()
      setPost(data)
    } catch (error) {
      console.error("Erro ao carregar post:", error)
      toast.error("Erro ao carregar post")
    } finally {
      setLoading(false)
    }
  }

  async function savePost() {
    if (!post) return

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
      router.push("/admin/posts")
    } catch (error) {
      console.error("Erro ao salvar post:", error)
      toast.error("Erro ao salvar post")
    } finally {
      setSaving(false)
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

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!post) {
    return <div>Post não encontrado</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Editar Post</h1>
          <p className="text-muted-foreground">
            Edite o conteúdo do seu post.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push("/admin/posts")}>
            Voltar
          </Button>
          <Button onClick={savePost} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
          <Button variant="destructive" onClick={deletePost}>
            Deletar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Configure as informações básicas do post.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input
                value={post.slug}
                onChange={(e) => setPost({ ...post, slug: e.target.value })}
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={post.description}
                onChange={(e) => setPost({ ...post, description: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={post.published}
                onCheckedChange={(checked) =>
                  setPost({ ...post, published: checked })
                }
              />
              <Label htmlFor="published">Publicado</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conteúdo</CardTitle>
            <CardDescription>
              Escreva o conteúdo do seu post em Markdown.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div data-color-mode="dark">
              <MDEditor
                value={post.content}
                onChange={(value) => setPost({ ...post, content: value || "" })}
                height={500}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 