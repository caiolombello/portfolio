"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, ExternalLink, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const previews = [
  { name: "Home", path: "/opengraph-image" },
  { name: "Currículo", path: "/resume/opengraph-image" },
  { name: "Blog", path: "/blog/opengraph-image" },
  { name: "Contato", path: "/contact/opengraph-image" },
  {
    name: "Post em português",
    path: "/blog/kubernetes-hpa-custom-metrics.pt/opengraph-image",
  },
] as const;

export default function OGPreviewPage() {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const baseUrl = typeof window === "undefined" ? "" : window.location.origin;

  const copyUrl = async (path: string) => {
    await navigator.clipboard.writeText(`${baseUrl}${path}`);
    toast({ title: "URL copiada", description: "A URL da imagem foi copiada." });
  };

  return (
    <div className="container mx-auto space-y-8 py-8">
      <header className="mx-auto max-w-2xl space-y-4 text-center">
        <Badge variant="outline">Somente desenvolvimento</Badge>
        <h1 className="text-4xl font-bold text-gold">OpenGraph previews</h1>
        <p className="text-muted-foreground">
          Todas as rotas usam o mesmo template dinâmico 1200 × 630, com conteúdo
          específico para cada página.
        </p>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => setRefreshKey((value) => value + 1)}
        >
          <RefreshCw className="h-4 w-4" />
          Recarregar imagens
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {previews.map((preview) => (
          <Card key={`${preview.path}-${refreshKey}`} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{preview.name}</CardTitle>
                  <CardDescription>{preview.path}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-label={`Copiar URL de ${preview.name}`}
                    onClick={() => copyUrl(preview.path)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="outline" asChild>
                    <a
                      href={preview.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir imagem de ${preview.name}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${preview.path}?refresh=${refreshKey}`}
                alt={`Imagem OpenGraph de ${preview.name}`}
                className="aspect-[1200/630] w-full border-t object-cover"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Validar após o deploy</CardTitle>
          <CardDescription>
            Redes sociais mantêm cache. Use os inspetores para solicitar uma nova leitura.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer">
              Facebook Sharing Debugger
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.linkedin.com/post-inspector/" target="_blank" rel="noopener noreferrer">
              LinkedIn Post Inspector
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
