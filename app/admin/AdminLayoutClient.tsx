"use client"

import type React from "react"
import AdminSidebar from "@/components/admin/sidebar"
import AuthGuard from "@/components/admin/auth-guard"
import { usePathname } from "next/navigation"

// Componente client para verificar o pathname
export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col md:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </AuthGuard>
  )
}

