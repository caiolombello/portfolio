"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lock, AlertTriangle, Info } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isDevPassword, setIsDevPassword] = useState(false)
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  // Verificar se está usando a senha padrão de desenvolvimento
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDevPassword(!process.env.NEXT_PUBLIC_ADMIN_PASSWORD)
    }
  }, [])

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const success = await login(password)

      if (success) {
        router.push("/admin/dashboard")
      } else {
        setError("Senha incorreta")
      }
    } catch (error) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gold">Painel Administrativo</CardTitle>
          <CardDescription className="text-center">Digite a senha para acessar o painel administrativo</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {isDevPassword && (
              <Alert variant="warning" className="bg-amber-900/20 text-amber-400 border-amber-400/20">
                <Info className="h-4 w-4" />
                <AlertTitle>Ambiente de desenvolvimento</AlertTitle>
                <AlertDescription>
                  Você está usando a senha padrão de desenvolvimento. Para maior segurança, defina a variável de
                  ambiente NEXT_PUBLIC_ADMIN_PASSWORD.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

