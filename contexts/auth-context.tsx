"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Marcar que estamos no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Verificar autenticação ao carregar
  useEffect(() => {
    if (!isClient) return

    const checkAuth = () => {
      try {
        const auth = localStorage.getItem("admin_auth")
        setIsAuthenticated(auth === "true")
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [isClient])

  // Redirecionar com base na autenticação
  useEffect(() => {
    if (loading || !isClient) return

    const isAdminRoute = pathname?.startsWith("/admin") && pathname !== "/admin/login"

    if (isAdminRoute && !isAuthenticated) {
      router.push("/admin/login")
    } else if (pathname === "/admin/login" && isAuthenticated) {
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, loading, pathname, router, isClient])

  // Modificar a função login para usar uma variável de ambiente
  const login = async (password: string): Promise<boolean> => {
    try {
      // Obter a senha do ambiente ou usar um fallback para desenvolvimento
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"

      if (password === adminPassword) {
        localStorage.setItem("admin_auth", "true")
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      return false
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem("admin_auth")
      setIsAuthenticated(false)
      router.push("/admin/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

