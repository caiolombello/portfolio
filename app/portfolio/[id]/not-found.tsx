import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProjectNotFound() {
  return (
    <div className="container flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center py-12 text-center">
      <h1 className="mb-4 text-4xl font-bold text-gold">Projeto não encontrado</h1>
      <p className="mb-8 text-muted-foreground">O projeto que você está procurando não existe ou foi removido.</p>
      <Button asChild>
        <Link href="/portfolio">Voltar para o portfólio</Link>
      </Button>
    </div>
  )
}

