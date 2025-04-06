import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PostNotFound() {
  return (
    <div className="container flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center py-12 text-center">
      <h1 className="mb-4 text-4xl font-bold text-gold">Artigo não encontrado</h1>
      <p className="mb-8 text-muted-foreground">O artigo que você está procurando não existe ou foi removido.</p>
      <Button asChild>
        <Link href="/blog">Voltar para o blog</Link>
      </Button>
    </div>
  )
}

