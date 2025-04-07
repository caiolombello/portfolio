import { BlogPost } from "@/types/blog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface BlogGridProps {
  posts: BlogPost[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>{post.excerpt}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {post.coverImage && (
              <div className="relative aspect-video mb-4">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {new Date(post.date).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/blog/${post.slug}`}>Ler mais</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 