"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function AdminCertifications() {
  const [certifications, setCertifications] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await fetch("/api/admin/certifications")
        if (response.ok) {
          const data = await response.json()
          setCertifications(data)
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível carregar as certificações",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erro ao carregar certificações:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as certificações",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchCertifications()
    }
  }, [toast, isAuthenticated])

  const handleAddCertification = () => {
    setCertifications([...certifications, ""])
  }

  const handleRemoveCertification = (index: number) => {
    const newCertifications = [...certifications]
    newCertifications.splice(index, 1)
    setCertifications(newCertifications)
  }

  const handleCertificationChange = (index: number, value: string) => {
    const newCertifications = [...certifications]
    newCertifications[index] = value
    setCertifications(newCertifications)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch("/api/admin/certifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(certifications),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Certificações atualizadas com sucesso",
        })
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar as certificações",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao salvar certificações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as certificações",
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
      <h1 className="text-3xl font-bold text-gold mb-8">Gerenciar Certificações</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Certificações</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={handleAddCertification}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Certificação
            </Button>
          </CardHeader>
          <CardContent>
            {certifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma certificação cadastrada. Clique em "Adicionar Certificação" para começar.
              </p>
            ) : (
              <div className="space-y-4">
                {certifications.map((certification, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Nome da certificação"
                        value={certification}
                        onChange={(e) => handleCertificationChange(index, e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCertification(index)}
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

