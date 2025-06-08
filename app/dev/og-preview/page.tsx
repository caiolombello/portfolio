"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OGPreviewPage() {
  const { toast } = useToast();
  const [customTitle, setCustomTitle] = useState("");
  const [customSubtitle, setCustomSubtitle] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const previewPages = [
    {
      name: "Homepage",
      description: "Página principal do portfolio",
      url: "/api/og",
      badge: "Principal",
      color: "bg-blue-500"
    },
    {
      name: "Sobre/About",
      description: "Página sobre você (com foto de perfil)",
      url: "/api/og?title=Sobre&subtitle=Conheça minha trajetória profissional",
      badge: "About",
      color: "bg-blue-400"
    },
    {
      name: "Currículo",
      description: "Página do currículo",
      url: "/api/og?title=Currículo&subtitle=Experiência profissional e formação acadêmica",
      badge: "Resume",
      color: "bg-purple-500"
    },
    {
      name: "Projetos",
      description: "Portfolio de projetos",
      url: "/api/og?title=Projetos&subtitle=Confira meus trabalhos e conquistas",
      badge: "Portfolio",
      color: "bg-orange-500"
    },
    {
      name: "Blog",
      description: "Artigos e posts técnicos",
      url: "/api/og?title=Blog&subtitle=Artigos sobre tecnologia e desenvolvimento",
      badge: "Blog",
      color: "bg-red-500"
    },
    {
      name: "Contato",
      description: "Página de contato",
      url: "/api/og?title=Contato&subtitle=Vamos conversar sobre seu próximo projeto",
      badge: "Contact",
      color: "bg-cyan-500"
    }
  ];

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const copyUrl = (url: string) => {
    const fullUrl = `${baseUrl}${url}`;
    navigator.clipboard.writeText(fullUrl);
    toast({
      title: "URL copiada!",
      description: "A URL da imagem foi copiada para a área de transferência.",
    });
  };

  const openInNewTab = (url: string) => {
    window.open(`${baseUrl}${url}`, '_blank');
  };

  const generateCustomPreviewUrl = () => {
    if (!customTitle.trim()) {
      return null;
    }

    const params = new URLSearchParams();
    params.append('title', customTitle);
    if (customSubtitle.trim()) {
      params.append('subtitle', customSubtitle);
    }

    return `/api/og?${params.toString()}`;
  };

  const handleCopyCustomUrl = () => {
    if (!customTitle.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Digite um título para gerar o preview personalizado.",
        variant: "destructive",
      });
      return;
    }
    if (customPreviewUrl) {
      copyUrl(customPreviewUrl);
    }
  };

  const handleOpenCustomUrl = () => {
    if (!customTitle.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Digite um título para gerar o preview personalizado.",
        variant: "destructive",
      });
      return;
    }
    if (customPreviewUrl) {
      openInNewTab(customPreviewUrl);
    }
  };

  const customPreviewUrl = generateCustomPreviewUrl();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gold">
          🖼️ Open Graph Preview Tester
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Teste como as imagens de preview social do seu portfolio aparecem quando compartilhadas 
          em redes sociais como Facebook, Twitter, LinkedIn e WhatsApp.
        </p>
        <Button onClick={refresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Recarregar Previews
        </Button>
      </div>

      {/* Previews das páginas principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {previewPages.map((page, index) => (
          <Card key={`${page.name}-${refreshKey}`} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {page.name}
                    <Badge className={`${page.color} text-white`}>
                      {page.badge}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyUrl(page.url)}
                    className="gap-1"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openInNewTab(page.url)}
                    className="gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-[1200/630] bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${baseUrl}${page.url}&t=${refreshKey}`}
                  alt={`Preview for ${page.name}`}
                  className="w-full h-full object-cover border-t"
                  onError={(e) => {
                    e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="%23121212"/><text x="600" y="315" text-anchor="middle" fill="%23FFD700" font-size="48" font-family="Arial">Error loading preview</text></svg>`;
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Preview personalizado */}
      <Card>
        <CardHeader>
          <CardTitle>🎨 Preview Personalizado</CardTitle>
          <CardDescription>
            Crie um preview personalizado para testar títulos e subtítulos específicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="custom-title">Título *</Label>
              <Input
                id="custom-title"
                placeholder="Ex: Meu Projeto Incrível"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-subtitle">Subtítulo (opcional)</Label>
              <Input
                id="custom-subtitle"
                placeholder="Ex: Uma aplicação revolucionária"
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
              />
            </div>
          </div>

          {customTitle.trim() && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Preview:</h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyCustomUrl}
                    className="gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copiar URL
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleOpenCustomUrl}
                    className="gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Abrir
                  </Button>
                </div>
              </div>
              <div className="relative aspect-[1200/630] bg-muted border rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${baseUrl}${customPreviewUrl}&t=${refreshKey}`}
                  alt="Custom preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="%23121212"/><text x="600" y="315" text-anchor="middle" fill="%23FFD700" font-size="48" font-family="Arial">Error loading preview</text></svg>`;
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instruções de teste */}
      <Card>
        <CardHeader>
          <CardTitle>🧪 Como Testar em Redes Sociais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">Facebook</h4>
              <p className="text-sm text-muted-foreground">
                Use o Facebook Sharing Debugger para testar e limpar cache
              </p>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="w-full"
              >
                <a
                  href="https://developers.facebook.com/tools/debug/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Testar no Facebook
                </a>
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sky-600">Twitter</h4>
              <p className="text-sm text-muted-foreground">
                Valide como os Twitter Cards aparecem
              </p>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="w-full"
              >
                <a
                  href="https://cards-dev.twitter.com/validator"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Testar no Twitter
                </a>
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800">LinkedIn</h4>
              <p className="text-sm text-muted-foreground">
                Veja como os links aparecem no LinkedIn
              </p>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="w-full"
              >
                <a
                  href="https://www.linkedin.com/post-inspector/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Testar no LinkedIn
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">💡 Dicas:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Copie a URL da imagem e cole nas ferramentas de teste</li>
              <li>• Se fizer mudanças, use as ferramentas para limpar o cache</li>
              <li>• Teste também compartilhando diretamente no WhatsApp</li>
              <li>• Homepage e página "Sobre" mostram sua foto de perfil automaticamente</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 