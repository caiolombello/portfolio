"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

interface Education {
  degree: string
  institution: string
  period: string
  description: string
}

interface EducationData {
  pt: Education[]
  en: Education[]
}

export default function AdminEducation() {
  const [education, setEducation] = useState<EducationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await fetch("/api/admin/education")
        if (response.ok) {
          const data = await response.json()
          setEducation(data)
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados de educação",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erro ao carregar educação:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados de educação",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchEducation()
    }
  }, [toast, isAuthenticated])

  const handleAddEducation = (lang: "pt" | "en") => {
    if (!education) return

    setEducation({
      ...education,
      [lang]: [
        ...education[lang],
        {
          degree: "",
          institution: "",
          period: "",
          description: "",
        },
      ],
    })
  }

  const handleRemoveEducation = (lang: "pt" | "en", index: number) => {
    if (!education) return

    const newEducation = { ...education }
    newEducation[lang].splice(index, 1)
    setEducation(newEducation)
  }

  const handleEducationChange = (lang: "pt" | "en", index: number, field: keyof Education, value: string) => {
    if (!education) return

    const newEducation = { ...education }
    newEducation[lang][index] = {
      ...newEducation[lang][index],
      [field]: value,
    }
    setEducation(newEducation)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!education) return

    setSaving(true)
    try {
      const response = await fetch("/api/admin/education", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(education),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Educação atualizada com sucesso",
        })
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a educação",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao salvar educação:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a educação",
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

  if (!education) {
    return (
      <div className="text-center">
        <p>Não foi possível carregar os dados de educação.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gold mb-8">Gerenciar Educação</h1>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="pt">
          <TabsList className="mb-6">
            <TabsTrigger value="pt">Português</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
          </TabsList>

          <TabsContent value="pt">
            <div className="space-y-6">
              {education.pt.map((edu, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Formação {index + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveEducation("pt", index)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor={`pt-degree-${index}`} className="text-sm font-medium">
                        Grau/Curso
                      </label>
                      <Input
                        id={`pt-degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange("pt", index, "degree", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`pt-institution-${index}`} className="text-sm font-medium">
                        Instituição
                      </label>
                      <Input
                        id={`pt-institution-${index}`}
                        value={edu.institution}
                        onChange={(e) => handleEducationChange("pt", index, "institution", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`pt-period-${index}`} className="text-sm font-medium">
                        Período
                      </label>
                      <Input
                        id={`pt-period-${index}`}
                        value={edu.period}
                        onChange={(e) => handleEducationChange("pt", index, "period", e.target.value)}
                        required
                        placeholder="Ex: 2018 - 2022"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`pt-description-${index}`} className="text-sm font-medium">
                        Descrição
                      </label>
                      <Textarea
                        id={`pt-description-${index}`}
                        value={edu.description}
                        onChange={(e) => handleEducationChange("pt", index, "description", e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button type="button" onClick={() => handleAddEducation("pt")} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Nova Formação
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="en">
            <div className="space-y-6">
              {education.en.map((edu, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Education {index + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveEducation("en", index)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor={`en-degree-${index}`} className="text-sm font-medium">
                        Degree/Course
                      </label>
                      <Input
                        id={`en-degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange("en", index, "degree", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`en-institution-${index}`} className="text-sm font-medium">
                        Institution
                      </label>
                      <Input
                        id={`en-institution-${index}`}
                        value={edu.institution}
                        onChange={(e) => handleEducationChange("en", index, "institution", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`en-period-${index}`} className="text-sm font-medium">
                        Period
                      </label>
                      <Input
                        id={`en-period-${index}`}
                        value={edu.period}
                        onChange={(e) => handleEducationChange("en", index, "period", e.target.value)}
                        required
                        placeholder="Ex: 2018 - 2022"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`en-description-${index}`} className="text-sm font-medium">
                        Description
                      </label>
                      <Textarea
                        id={`en-description-${index}`}
                        value={edu.description}
                        onChange={(e) => handleEducationChange("en", index, "description", e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button type="button" onClick={() => handleAddEducation("en")} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Education
              </Button>
            </div>
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

