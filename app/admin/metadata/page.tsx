"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon
} from "@heroicons/react/24/outline"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { defaultMetadata, type SiteMetadata } from "@/types/metadata"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface RobotsMetadata {
  index: boolean
  follow: boolean
  noarchive: boolean
  nosnippet: boolean
  noimageindex: boolean
  notranslate: boolean
  googleBot: {
    index: boolean
    follow: boolean
    noarchive: boolean
    nosnippet: boolean
    noimageindex: boolean
    notranslate: boolean
    maxSnippet: number
    maxImagePreview: string
    maxVideoPreview: number
  }
}

interface Metadata {
  robots: RobotsMetadata
  verification: {
    google: string
    bing: string
    yandex: string
    other: Record<string, string>
  }
}

export default function AdminMetadata() {
  const [metadata, setMetadata] = useState<SiteMetadata>(defaultMetadata)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/metadata")
        if (response.ok) {
          const data = await response.json()
          setMetadata(data)
        } else {
          console.error("Erro na resposta da API:", response.status, response.statusText)
          setMetadata(defaultMetadata)
          toast({
            title: "Aviso",
            description: "Usando configurações padrão de SEO. Você pode personalizá-las e salvar.",
          })
        }
      } catch (error) {
        console.error("Erro ao carregar metadados:", error)
        setMetadata(defaultMetadata)
        toast({
          title: "Aviso",
          description: "Usando configurações padrão de SEO. Você pode personalizá-las e salvar.",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchMetadata()
    }
  }, [toast, isAuthenticated])

  const validateMetadata = (): boolean => {
    const errors: Record<string, string> = {}

    if (!metadata.title.default.trim()) {
      errors["title.default"] = "O título padrão é obrigatório"
    }

    if (!metadata.title.template.trim()) {
      errors["title.template"] = "O template de título é obrigatório"
    }

    if (!metadata.description.trim()) {
      errors["description"] = "A descrição é obrigatória"
    }

    if (!metadata.openGraph.siteName.trim()) {
      errors["openGraph.siteName"] = "O nome do site é obrigatório"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = <T extends keyof SiteMetadata>(field: T, value: SiteMetadata[T]) => {
    setMetadata({
      ...metadata,
      [field]: value,
    })

    setSaveSuccess(false)
    setSaveError(null)
    setValidationErrors({})
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    const parentField = metadata[parent as keyof SiteMetadata];
    if (typeof parentField === 'object' && parentField !== null) {
      setMetadata({
        ...metadata,
        [parent]: {
          ...parentField,
          [field]: value,
        },
      });
    }

    setSaveSuccess(false);
    setSaveError(null);
    setValidationErrors({});
  };

  const handleKeywordsChange = (value: string) => {
    const keywords = value
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean)
    setMetadata({
      ...metadata,
      keywords,
    })

    setSaveSuccess(false)
    setSaveError(null)
  }

  const handleAuthorsChange = (value: string) => {
    const authors = value
      .split(",")
      .map((author) => author.trim())
      .filter(Boolean)
    setMetadata({
      ...metadata,
      authors,
    })

    setSaveSuccess(false)
    setSaveError(null)
  }

  const handleRobotsChange = (key: keyof RobotsMetadata, checked: boolean) => {
    setMetadata({
      ...metadata,
      robots: {
        ...metadata.robots,
        [key]: checked,
      },
    })
  }

  const handleGoogleBotChange = (key: keyof RobotsMetadata["googleBot"], checked: boolean | number | string) => {
    setMetadata({
      ...metadata,
      robots: {
        ...metadata.robots,
        googleBot: {
          ...metadata.robots.googleBot,
          [key]: checked,
        },
      },
    })
  }

  const handleVerificationChange = (field: string, value: string) => {
    setMetadata({
      ...metadata,
      verification: {
        ...metadata.verification,
        [field]: value,
      },
    })

    setSaveSuccess(false)
    setSaveError(null)
  }

  const handleAddVerification = () => {
    const name = prompt("Digite o nome da verificação:")
    if (!name) return

    const value = prompt(`Digite o valor para a verificação "${name}":`)
    if (value === null) return

    setMetadata({
      ...metadata,
      verification: {
        ...metadata.verification,
        other: {
          ...metadata.verification.other,
          [name]: value,
        },
      },
    })

    setSaveSuccess(false)
    setSaveError(null)
  }

  const handleRemoveVerification = (name: string) => {
    const newOther = { ...metadata.verification.other }
    delete newOther[name]

    setMetadata({
      ...metadata,
      verification: {
        ...metadata.verification,
        other: newOther,
      },
    })

    setSaveSuccess(false)
    setSaveError(null)
  }

  const handleResetToDefaults = () => {
    if (
      window.confirm(
        "Tem certeza que deseja redefinir todos os metadados para os valores padrão? Esta ação não pode ser desfeita.",
      )
    ) {
      setMetadata(defaultMetadata)
      setSaveSuccess(false)
      setSaveError(null)
      setValidationErrors({})
    }
  }

  const handleExport = () => {
    const data = JSON.stringify(metadata, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "metadata.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        setMetadata(data)
        setSaveSuccess(false)
        setSaveError(null)
        setValidationErrors({})
        toast({
          title: "Sucesso",
          description: "Configurações importadas com sucesso",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Arquivo inválido",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateMetadata()) {
      toast({
        title: "Erro",
        description: "Por favor, corrija os erros antes de salvar",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    setSaveSuccess(false)
    setSaveError(null)

    try {
      const response = await fetch("/api/admin/metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSaveSuccess(true)
        toast({
          title: "Sucesso",
          description: "Metadados atualizados com sucesso",
        })
      } else {
        const errorMessage = data.error || "Não foi possível atualizar os metadados"
        setSaveError(errorMessage)
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao salvar metadados:", error)
      setSaveError("Erro de conexão ao tentar salvar os metadados")
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os metadados",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gold">Configurações de SEO</h1>
        <div className="flex gap-2">
          <Button
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            )}
            asChild
          >
            <DialogTrigger>
              <EyeIcon className="mr-2 h-4 w-4" />
              Preview
            </DialogTrigger>
          </Button>

          <Button
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            )}
            onClick={handleExport}
          >
            <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
            Exportar
          </Button>

          <div className="flex items-center space-x-2">
            <button
              className={buttonVariants({ variant: "outline", size: "sm" })}
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.json'
                input.onchange = (e) => handleImport(e as unknown as React.ChangeEvent<HTMLInputElement>)
                input.click()
              }}
            >
              <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
              Importar
            </button>
          </div>

          <Button
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            )}
            onClick={handleResetToDefaults}
          >
            <ArrowPathIcon className="mr-2 h-4 w-4" />
            Restaurar Padrões
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Salvo com sucesso!</AlertTitle>
          <AlertDescription className="text-green-700">
            Os metadados foram atualizados com sucesso. As alterações podem levar alguns minutos para serem aplicadas em
            todo o site.
          </AlertDescription>
        </Alert>
      )}

      {saveError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Erro ao salvar</AlertTitle>
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="robots">Robots</TabsTrigger>
            <TabsTrigger value="verification">Verificação</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Informações Gerais</CardTitle>
                <CardDescription>Configurações básicas de SEO e metadados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title-default">Título Padrão</Label>
                    <span className="text-xs text-muted-foreground">
                      {metadata.title.default.length}/60 caracteres
                    </span>
                  </div>
                  <Input
                    id="title-default"
                    value={metadata.title.default}
                    onChange={(e) => handleNestedChange("title", "default", e.target.value)}
                    required
                    className={validationErrors["title.default"] ? "border-red-500" : ""}
                  />
                  {validationErrors["title.default"] && (
                    <p className="text-xs text-red-500">{validationErrors["title.default"]}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Este é o título principal do seu site, usado quando não há um título específico para a página.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="title-template">Template de Título</Label>
                    <span className="text-xs text-muted-foreground">
                      {metadata.title.template.length}/100 caracteres
                    </span>
                  </div>
                  <Input
                    id="title-template"
                    value={metadata.title.template}
                    onChange={(e) => handleNestedChange("title", "template", e.target.value)}
                    required
                    className={validationErrors["title.template"] ? "border-red-500" : ""}
                  />
                  {validationErrors["title.template"] && (
                    <p className="text-xs text-red-500">{validationErrors["title.template"]}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Use %s para indicar onde o título da página será inserido. Ex: "%s | Meu Site"
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">Descrição</Label>
                    <span className="text-xs text-muted-foreground">
                      {metadata.description.length}/160 caracteres
                    </span>
                  </div>
                  <Textarea
                    id="description"
                    value={metadata.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                    className={validationErrors["description"] ? "border-red-500" : ""}
                  />
                  {validationErrors["description"] && (
                    <p className="text-xs text-red-500">{validationErrors["description"]}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Uma breve descrição do seu site, usada por mecanismos de busca e compartilhamentos em redes sociais.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Palavras-chave</Label>
                  <Textarea
                    id="keywords"
                    value={metadata.keywords.join(", ")}
                    onChange={(e) => handleKeywordsChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Palavras-chave separadas por vírgula. Embora tenham menos importância hoje, ainda podem ser úteis.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authors">Autores</Label>
                  <Input
                    id="authors"
                    value={metadata.authors.join(", ")}
                    onChange={(e) => handleAuthorsChange(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="creator">Criador</Label>
                    <Input
                      id="creator"
                      value={metadata.creator}
                      onChange={(e) => handleChange("creator", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publisher">Publicador</Label>
                    <Input
                      id="publisher"
                      value={metadata.publisher}
                      onChange={(e) => handleChange("publisher", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="robots">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Robots</CardTitle>
                <CardDescription>Controle como os motores de busca indexam seu site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="robots-index" className="text-base">
                        Indexar Site
                      </Label>
                      <p className="text-sm text-muted-foreground">Permite que os motores de busca indexem seu site</p>
                    </div>
                    <Switch
                      id="robots-index"
                      checked={metadata.robots.index}
                      onCheckedChange={(checked: boolean) => handleRobotsChange("index", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="robots-follow" className="text-base">
                        Seguir Links
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Permite que os motores de busca sigam os links do seu site
                      </p>
                    </div>
                    <Switch
                      id="robots-follow"
                      checked={metadata.robots.follow}
                      onCheckedChange={(checked: boolean) => handleRobotsChange("follow", checked)}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Configurações do Google Bot</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="googlebot-index" className="text-base">
                          Indexar Site
                        </Label>
                        <p className="text-sm text-muted-foreground">Permite que o Google indexe seu site</p>
                      </div>
                      <Switch
                        id="googlebot-index"
                        checked={metadata.robots.googleBot.index}
                        onCheckedChange={(checked: boolean) => handleGoogleBotChange("index", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="googlebot-follow" className="text-base">
                          Seguir Links
                        </Label>
                        <p className="text-sm text-muted-foreground">Permite que o Google siga os links do seu site</p>
                      </div>
                      <Switch
                        id="googlebot-follow"
                        checked={metadata.robots.googleBot.follow}
                        onCheckedChange={(checked: boolean) => handleGoogleBotChange("follow", checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="googlebot-maxVideoPreview">Tamanho Máximo de Preview de Vídeo</Label>
                      <Input
                        id="googlebot-maxVideoPreview"
                        type="number"
                        value={metadata.robots.googleBot.maxVideoPreview}
                        onChange={(e) => handleGoogleBotChange("maxVideoPreview", Number.parseInt(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">
                        -1 para sem limite, ou um número positivo para limitar o tamanho em segundos
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="googlebot-maxImagePreview">Tamanho Máximo de Preview de Imagem</Label>
                      <select
                        id="googlebot-maxImagePreview"
                        value={metadata.robots.googleBot.maxImagePreview}
                        onChange={(e) => handleGoogleBotChange("maxImagePreview", e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="none">Nenhum</option>
                        <option value="standard">Padrão</option>
                        <option value="large">Grande</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="googlebot-maxSnippet">Tamanho Máximo de Snippet</Label>
                      <Input
                        id="googlebot-maxSnippet"
                        type="number"
                        value={metadata.robots.googleBot.maxSnippet}
                        onChange={(e) => handleGoogleBotChange("maxSnippet", Number.parseInt(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">
                        -1 para sem limite, ou um número positivo para limitar o tamanho em caracteres
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Verificação de Propriedade</CardTitle>
                <CardDescription>Códigos de verificação para provar a propriedade do site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verification-google">Google Search Console</Label>
                  <Input
                    id="verification-google"
                    value={metadata.verification.google}
                    onChange={(e) => handleVerificationChange("google", e.target.value)}
                    placeholder="Código de verificação do Google"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification-yandex">Yandex Webmaster</Label>
                  <Input
                    id="verification-yandex"
                    value={metadata.verification.yandex}
                    onChange={(e) => handleVerificationChange("yandex", e.target.value)}
                    placeholder="Código de verificação do Yandex"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification-yahoo">Yahoo Site Explorer</Label>
                  <Input
                    id="verification-yahoo"
                    value={metadata.verification.yahoo}
                    onChange={(e) => handleVerificationChange("yahoo", e.target.value)}
                    placeholder="Código de verificação do Yahoo"
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Outras Verificações</h3>
                    <Button
                      className={cn(
                        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                      )}
                      onClick={handleAddVerification}
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>

                  {Object.keys(metadata.verification.other).length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma verificação adicional configurada.</p>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(metadata.verification.other).map(([name, value]) => (
                        <div key={name} className="flex items-center gap-2">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <Input value={name} disabled />
                            <Input
                              value={value}
                              onChange={(e) => {
                                const newOther = { ...metadata.verification.other }
                                newOther[name] = e.target.value
                                setMetadata({
                                  ...metadata,
                                  verification: {
                                    ...metadata.verification,
                                    other: newOther,
                                  },
                                })
                              }}
                            />
                          </div>
                          <Button
                            className={cn(
                              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            )}
                            onClick={() => handleRemoveVerification(name)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

