"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Skill {
  name: string
  percentage: number
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/admin/skills")
        if (response.ok) {
          const data = await response.json()
          setSkills(data)
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível carregar as habilidades",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erro ao carregar habilidades:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as habilidades",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchSkills()
    }
  }, [toast, isAuthenticated])

  const handleAddSkill = () => {
    setSkills([...skills, { name: "", percentage: 50 }])
  }

  const handleRemoveSkill = (index: number) => {
    const newSkills = [...skills]
    newSkills.splice(index, 1)
    setSkills(newSkills)
  }

  const handleSkillChange = (index: number, field: keyof Skill, value: string | number) => {
    const newSkills = [...skills]
    newSkills[index] = {
      ...newSkills[index],
      [field]: field === "percentage" ? Math.min(100, Math.max(0, Number(value))) : value,
    }
    setSkills(newSkills)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch("/api/admin/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skills),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Habilidades atualizadas com sucesso",
        })
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar as habilidades",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao salvar habilidades:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as habilidades",
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
      <h1 className="text-3xl font-bold text-gold mb-8">Gerenciar Habilidades</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Habilidades Técnicas</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={handleAddSkill}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Habilidade
            </Button>
          </CardHeader>
          <CardContent>
            {skills.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma habilidade cadastrada. Clique em "Adicionar Habilidade" para começar.
              </p>
            ) : (
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Nome da habilidade"
                        value={skill.name}
                        onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="w-20">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={skill.percentage}
                        onChange={(e) => handleSkillChange(index, "percentage", e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSkill(index)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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

