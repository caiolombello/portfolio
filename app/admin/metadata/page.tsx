"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2, RefreshCw, Eye, Download, Upload } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { defaultMetadata, type SiteMetadata } from "@/types/metadata"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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
    setMetadata({
      ...metadata,
      [parent]: {
        ...metadata[parent as keyof SiteMetadata],
        [field]: value,
      },
    })

    setSaveSuccess(false)
    setSaveError(null)
    setValidationErrors({})
  }

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

  const handleRobotsChange = (field: string, value: boolean) => {
    setMetadata({
      ...metadata,
      robots: {
        ...metadata.robots,
        [field]: value,
      },
    })

    setSaveSuccess(false)
    setSaveError(null)
  }

  const handleGoogleBotChange = (field: string, value: any) => {
    setMetadata({
      ...metadata,
      robots: {
        ...metadata.robots,
        googleBot: {
          ...metadata.robots.googleBot,
          [field]: value,
        },
      },
    })

    setSaveSuccess(false)
    setSaveError(null)
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
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gold">Configurações de SEO</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Preview de Metadados</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Google Search</h3>
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="text-blue-600 text-lg">{metadata.title.default}</div>
                    <div className="text-green-700">{metadata.openGraph.siteName}</div>
                    <div className="text-gray-600 text-sm">{metadata.description}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Facebook</h3>
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="font-bold">{metadata.openGraph.title}</div>
                    <div className="text-sm text-gray-600">{metadata.openGraph.description}</div>
                    <div className="text-xs text-gray-500">{metadata.openGraph.siteName}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Twitter</h3>
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="font-bold">{metadata.twitter.description}</div>
                    <div className="text-sm text-gray-600">@{metadata.twitter.creator}</div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>

          <label className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            Importar
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <Button variant="outline" onClick={handleResetToDefaults}>
            <RefreshCw className="mr-2 h-4 w-4" />
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
        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="robots">Robots</TabsTrigger>
            <TabsTrigger value="verification">Verificação</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Configure as informações básicas do seu site</CardDescription>
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

          <TabsContent value="social">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Open Graph</CardTitle>
                <CardDescription>Configurações para compartilhamento em redes sociais como Facebook</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="og-title">Título</Label>
                  <Input
                    id="og-title"
                    value={metadata.openGraph.title}
                    onChange={(e) => handleNestedChange("openGraph", "title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="og-description">Descrição</Label>
                    <span className="text-xs text-muted-foreground">
                      {metadata.openGraph.description.length}/200 caracteres
                    </span>
                  </div>
                  <Textarea
                    id="og-description"
                    value={metadata.openGraph.description}
                    onChange={(e) => handleNestedChange("openGraph", "description", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="og-siteName">Nome do Site</Label>
                    <Input
                      id="og-siteName"
                      value={metadata.openGraph.siteName}
                      onChange={(e) => handleNestedChange("openGraph", "siteName", e.target.value)}
                      required
                      className={validationErrors["openGraph.siteName"] ? "border-red-500" : ""}
                    />
                    {validationErrors["openGraph.siteName"] && (
                      <p className="text-xs text-red-500">{validationErrors["openGraph.siteName"]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="og-locale">Localidade</Label>
                    <Input
                      id="og-locale"
                      value={metadata.openGraph.locale}
                      onChange={(e) => handleNestedChange("openGraph", "locale", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Ex: pt_BR, en_US</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Twitter</CardTitle>
                <CardDescription>Configurações para compartilhamento no Twitter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter-card">Tipo de Card</Label>
                  <select
                    id="twitter-card"
                    value={metadata.twitter.card}
                    onChange={(e) => handleNestedChange("twitter", "card", e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                    <option value="app">App</option>
                    <option value="player">Player</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter-creator">Criador</Label>
                  <Input
                    id="twitter-creator"
                    value={metadata.twitter.creator}
                    onChange={(e) => handleNestedChange("twitter", "creator", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Seu nome de usuário no Twitter, incluindo o @. Ex: @caiolombelllo
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twitter-description">Descrição</Label>
                    <span className="text-xs text-muted-foreground">
                      {metadata.twitter.description.length}/200 caracteres
                    </span>
                  </div>
                  <Textarea
                    id="twitter-description"
                    value={metadata.twitter.description}
                    onChange={(e) => handleNestedChange("twitter", "description", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links">
            <Card>
              <CardHeader>
                <CardTitle>Links e Contatos</CardTitle>
                <CardDescription>Configure seus links sociais e informações de contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={metadata.links.website}
                      onChange={(e) => handleNestedChange("links", "website", e.target.value)}
                      placeholder="https://caio.lombello.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={metadata.links.email}
                      onChange={(e) => handleNestedChange("links", "email", e.target.value)}
                      placeholder="caio@lombello.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={metadata.links.github}
                      onChange={(e) => handleNestedChange("links", "github", e.target.value)}
                      placeholder="https://github.com/caiolombello"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gitlab">GitLab</Label>
                    <Input
                      id="gitlab"
                      value={metadata.links.gitlab}
                      onChange={(e) => handleNestedChange("links", "gitlab", e.target.value)}
                      placeholder="https://gitlab.com/caiolombello"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={metadata.links.linkedin}
                      onChange={(e) => handleNestedChange("links", "linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/caiolvbarbieri"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter/X</Label>
                    <Input
                      id="twitter"
                      value={metadata.links.twitter}
                      onChange={(e) => handleNestedChange("links", "twitter", e.target.value)}
                      placeholder="https://x.com/caiolombello"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stackoverflow">Stack Overflow</Label>
                    <Input
                      id="stackoverflow"
                      value={metadata.links.stackoverflow || ""}
                      onChange={(e) => handleNestedChange("links", "stackoverflow", e.target.value)}
                      placeholder="https://stackoverflow.com/users/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="devto">Dev.to</Label>
                    <Input
                      id="devto"
                      value={metadata.links.devto || ""}
                      onChange={(e) => handleNestedChange("links", "devto", e.target.value)}
                      placeholder="https://dev.to/caiolombello"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medium">Medium</Label>
                    <Input
                      id="medium"
                      value={metadata.links.medium || ""}
                      onChange={(e) => handleNestedChange("links", "medium", e.target.value)}
                      placeholder="https://medium.com/@caiolombello"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hashnode">Hashnode</Label>
                    <Input
                      id="hashnode"
                      value={metadata.links.hashnode || ""}
                      onChange={(e) => handleNestedChange("links", "hashnode", e.target.value)}
                      placeholder="https://hashnode.com/@caiolombello"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="behance">Behance</Label>
                    <Input
                      id="behance"
                      value={metadata.links.behance || ""}
                      onChange={(e) => handleNestedChange("links", "behance", e.target.value)}
                      placeholder="https://behance.net/caiolombello"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dribbble">Dribbble</Label>
                    <Input
                      id="dribbble"
                      value={metadata.links.dribbble || ""}
                      onChange={(e) => handleNestedChange("links", "dribbble", e.target.value)}
                      placeholder="https://dribbble.com/caiolombello"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="figma">Figma</Label>
                    <Input
                      id="figma"
                      value={metadata.links.figma || ""}
                      onChange={(e) => handleNestedChange("links", "figma", e.target.value)}
                      placeholder="https://figma.com/@caiolombello"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credly">Credly</Label>
                    <Input
                      id="credly"
                      value={metadata.links.credly || ""}
                      onChange={(e) => handleNestedChange("links", "credly", e.target.value)}
                      placeholder="https://credly.com/users/caiolombello"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="microsoftLearn">Microsoft Learn</Label>
                    <Input
                      id="microsoftLearn"
                      value={metadata.links.microsoftLearn || ""}
                      onChange={(e) => handleNestedChange("links", "microsoftLearn", e.target.value)}
                      placeholder="https://learn.microsoft.com/pt-br/users/caiolombello"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="awsTraining">AWS Training</Label>
                    <Input
                      id="awsTraining"
                      value={metadata.links.awsTraining || ""}
                      onChange={(e) => handleNestedChange("links", "awsTraining", e.target.value)}
                      placeholder="https://aws.amazon.com/training/..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={metadata.links.whatsapp || ""}
                      onChange={(e) => handleNestedChange("links", "whatsapp", e.target.value)}
                      placeholder="https://wa.me/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telegram">Telegram</Label>
                    <Input
                      id="telegram"
                      value={metadata.links.telegram || ""}
                      onChange={(e) => handleNestedChange("links", "telegram", e.target.value)}
                      placeholder="https://t.me/caiolombello"
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
              <CardContent className="space-y-6">
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
                      onCheckedChange={(checked) => handleRobotsChange("index", checked)}
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
                      onCheckedChange={(checked) => handleRobotsChange("follow", checked)}
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
                        onCheckedChange={(checked) => handleGoogleBotChange("index", checked)}
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
                        onCheckedChange={(checked) => handleGoogleBotChange("follow", checked)}
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
                    <Button type="button" variant="outline" size="sm" onClick={handleAddVerification}>
                      <Plus className="h-4 w-4 mr-2" />
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
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveVerification(name)}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

