import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSiteConfig } from "@/lib/config-server";
import { isPortfolioEnabled } from "@/lib/site-features";

export default function ProjectNotFound() {
  const portfolioEnabled = isPortfolioEnabled(getSiteConfig());

  return (
    <div className="container flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
        404
      </p>
      <h1 className="mb-4 mt-4 text-4xl font-semibold tracking-[-0.03em]">
        Projeto não encontrado
      </h1>
      <p className="mb-8 text-muted-foreground">
        O projeto que você está procurando não existe ou foi removido.
      </p>
      <Button asChild>
        <Link href={portfolioEnabled ? "/portfolio" : "/"}>
          {portfolioEnabled ? "Voltar para o portfólio" : "Voltar ao início"}
        </Link>
      </Button>
    </div>
  );
}
