import { Metadata } from "next"
import { AdminNav } from "@/components/admin-nav"

export const metadata: Metadata = {
  title: "Admin - Caio Lombello",
  description: "Painel de administração do site de Caio Lombello",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="container mx-auto py-8">
        {children}
      </main>
    </div>
  )
}

