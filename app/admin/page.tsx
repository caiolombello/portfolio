import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getBlob } from "@/lib/blob-storage"

async function getStats() {
  try {
    const [posts, projects] = await Promise.all([
      getBlob("posts.json"),
      getBlob("projects.json"),
    ])

    return {
      posts: posts ? JSON.parse(posts).length : 0,
      projects: projects ? JSON.parse(projects).length : 0,
    }
  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error)
    return {
      posts: 0,
      projects: 0,
    }
  }
}

export default async function AdminPage() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel de administração. Aqui você pode gerenciar todo o conteúdo do seu site.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.posts}</div>
            <p className="text-xs text-muted-foreground">
              Total de posts no blog
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projects}</div>
            <p className="text-xs text-muted-foreground">
              Total de projetos no portfólio
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Posts</CardTitle>
            <CardDescription>
              Gerencie os posts do seu blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/posts">Gerenciar Posts</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projetos</CardTitle>
            <CardDescription>
              Gerencie os projetos do seu portfólio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/projects">Gerenciar Projetos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
            <CardDescription>
              Configure as configurações de SEO do seu site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/seo">Configurar SEO</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 