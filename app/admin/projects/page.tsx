"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ArrowPathIcon, PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useAuth } from "@/contexts/auth-context"

interface Project {
  id: string
  title: string
  category: string
  imageUrl: string
  shortDescription: string
  technologies: string[]
  fullDescription: string
  demoUrl: string
  repoUrl: string
  screenshots: string[]
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/admin/projects")
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível carregar os projetos",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erro ao carregar projetos:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os projetos",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchProjects()
    }
  }, [toast, isAuthenticated])

  const handleAddProject = () => {
    const newId = `project-${Date.now()}`
    setProjects([
      ...projects,
      {
        id: newId,
        title: "",
        category: "",
        imageUrl: "/placeholder.svg?height=300&width=500",
        shortDescription: "",
        technologies: [""],
        fullDescription: "",
        demoUrl: "#",
        repoUrl: "#",
        screenshots: ["/placeholder.svg?height=300&width=600&text=Screenshot 1"],
      },
    ])
  }

  const handleRemoveProject = (index: number) => {
    const newProjects = [...projects]
    newProjects.splice(index, 1)
    setProjects(newProjects)
  }

  const handleProjectChange = (
    index: number,
    field: keyof Omit<Project, "technologies" | "screenshots">,
    value: string,
  ) => {
    const newProjects = [...projects]
    newProjects[index] = {
      ...newProjects[index],
      [field]: value,
    }
    setProjects(newProjects)
  }

  const handleAddTechnology = (projectIndex: number) => {
    const newProjects = [...projects]
    newProjects[projectIndex].technologies.push("")
    setProjects(newProjects)
  }

  const handleRemoveTechnology = (projectIndex: number, techIndex: number) => {
    const newProjects = [...projects]
    newProjects[projectIndex].technologies.splice(techIndex, 1)
    setProjects(newProjects)
  }

  const handleTechnologyChange = (projectIndex: number, techIndex: number, value: string) => {
    const newProjects = [...projects]
    newProjects[projectIndex].technologies[techIndex] = value
    setProjects(newProjects)
  }

  const handleAddScreenshot = (projectIndex: number) => {
    const newProjects = [...projects]
    const screenshotNumber = newProjects[projectIndex].screenshots.length + 1
    newProjects[projectIndex].screenshots.push(
      `/placeholder.svg?height=300&width=600&text=Screenshot ${screenshotNumber}`,
    )
    setProjects(newProjects)
  }

  const handleRemoveScreenshot = (projectIndex: number, screenshotIndex: number) => {
    const newProjects = [...projects]
    newProjects[projectIndex].screenshots.splice(screenshotIndex, 1)
    setProjects(newProjects)
  }

  const handleScreenshotChange = (projectIndex: number, screenshotIndex: number, value: string) => {
    const newProjects = [...projects]
    newProjects[projectIndex].screenshots[screenshotIndex] = value
    setProjects(newProjects)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projects),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Projetos atualizados com sucesso",
        })
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar os projetos",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao salvar projetos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os projetos",
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
      <h1 className="text-3xl font-bold text-gold mb-8">Gerenciar Projetos</h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{project.title || `Projeto ${index + 1}`}</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveProject(index)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor={`title-${index}`} className="text-sm font-medium">
                      Título
                    </label>
                    <Input
                      id={`title-${index}`}
                      value={project.title}
                      onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`category-${index}`} className="text-sm font-medium">
                      Categoria
                    </label>
                    <Input
                      id={`category-${index}`}
                      value={project.category}
                      onChange={(e) => handleProjectChange(index, "category", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor={`id-${index}`} className="text-sm font-medium">
                    ID (usado na URL)
                  </label>
                  <Input
                    id={`id-${index}`}
                    value={project.id}
                    onChange={(e) => handleProjectChange(index, "id", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor={`imageUrl-${index}`} className="text-sm font-medium">
                    URL da Imagem Principal
                  </label>
                  <Input
                    id={`imageUrl-${index}`}
                    value={project.imageUrl}
                    onChange={(e) => handleProjectChange(index, "imageUrl", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor={`shortDescription-${index}`} className="text-sm font-medium">
                    Descrição Curta
                  </label>
                  <Textarea
                    id={`shortDescription-${index}`}
                    value={project.shortDescription}
                    onChange={(e) => handleProjectChange(index, "shortDescription", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Tecnologias</label>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddTechnology(index)}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {project.technologies.map((tech, techIndex) => (
                      <div key={techIndex} className="flex items-center gap-2">
                        <Input
                          value={tech}
                          onChange={(e) => handleTechnologyChange(index, techIndex, e.target.value)}
                          required
                          placeholder={`Tecnologia ${techIndex + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTechnology(index, techIndex)}
                          disabled={project.technologies.length <= 1}
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor={`fullDescription-${index}`} className="text-sm font-medium">
                    Descrição Completa
                  </label>
                  <Textarea
                    id={`fullDescription-${index}`}
                    value={project.fullDescription}
                    onChange={(e) => handleProjectChange(index, "fullDescription", e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor={`demoUrl-${index}`} className="text-sm font-medium">
                      URL da Demo
                    </label>
                    <Input
                      id={`demoUrl-${index}`}
                      value={project.demoUrl}
                      onChange={(e) => handleProjectChange(index, "demoUrl", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor={`repoUrl-${index}`} className="text-sm font-medium">
                      URL do Repositório
                    </label>
                    <Input
                      id={`repoUrl-${index}`}
                      value={project.repoUrl}
                      onChange={(e) => handleProjectChange(index, "repoUrl", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Screenshots</label>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddScreenshot(index)}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {project.screenshots.map((screenshot, screenshotIndex) => (
                      <div key={screenshotIndex} className="flex items-center gap-2">
                        <Input
                          value={screenshot}
                          onChange={(e) => handleScreenshotChange(index, screenshotIndex, e.target.value)}
                          required
                          placeholder={`Screenshot ${screenshotIndex + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveScreenshot(index, screenshotIndex)}
                          disabled={project.screenshots.length <= 1}
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button type="button" onClick={handleAddProject} className="w-full">
            <PlusIcon className="h-4 w-4 mr-2" />
            Adicionar Novo Projeto
          </Button>
        </div>

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

