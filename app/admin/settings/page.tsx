"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface SiteSettings {
  siteName: string
  baseUrl: string
  contactEmail: string
  socialLinks: {
    github: string
    linkedin: string
    twitter: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Caio Lombello",
    baseUrl: "https://caiolombelllo.com",
    contactEmail: "contato@caiolombelllo.com",
    socialLinks: {
      github: "https://github.com/caiolombello",
      linkedin: "https://linkedin.com/in/caiolombello",
      twitter: "https://twitter.com/caiolombello",
    },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const response = await fetch("/api/admin/settings")
      if (!response.ok) throw new Error("Erro ao carregar configurações")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Erro ao carregar configurações:", error)
      toast.error("Erro ao carregar configurações")
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error("Erro ao salvar configurações")

      toast.success("Configurações salvas com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      toast.error("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Configure as configurações gerais do seu site.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Configure as informações básicas do seu site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nome do Site</Label>
            <Input
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>
          <div>
            <Label>URL Base</Label>
            <Input
              value={settings.baseUrl}
              onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
            />
          </div>
          <div>
            <Label>Email de Contato</Label>
            <Input
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redes Sociais</CardTitle>
          <CardDescription>
            Configure os links para suas redes sociais.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>GitHub</Label>
            <Input
              value={settings.socialLinks.github}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, github: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label>LinkedIn</Label>
            <Input
              value={settings.socialLinks.linkedin}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label>Twitter</Label>
            <Input
              value={settings.socialLinks.twitter}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  )
} 