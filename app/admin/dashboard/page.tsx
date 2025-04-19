"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartBarIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  FolderIcon,
  AcademicCapIcon,
  UserIcon,
  TrophyIcon,
  ChartPieIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function AdminDashboard() {
  const { isAuthenticated, loading } = useAuth()

  // Mostrar um indicador de carregamento enquanto verificamos a autenticação
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin h-8 w-8 border-4 border-gold rounded-full border-t-transparent"></div>
      </div>
    )
  }

  // Se não estiver autenticado, o AuthGuard já cuidará do redirecionamento
  if (!isAuthenticated) {
    return null
  }

  const cards = [
    {
      title: "Perfil",
      description: "Editar informações pessoais",
      icon: <UserIcon className="h-8 w-8 text-gold" />,
      href: "/admin/profile",
    },
    {
      title: "Habilidades",
      description: "Gerenciar habilidades técnicas",
      icon: <ChartBarIcon className="h-8 w-8 text-gold" />,
      href: "/admin/skills",
    },
    {
      title: "Experiências",
      description: "Adicionar ou editar experiências profissionais",
      icon: <BriefcaseIcon className="h-8 w-8 text-gold" />,
      href: "/admin/experiences",
    },
    {
      title: "Educação",
      description: "Gerenciar formação acadêmica",
      icon: <AcademicCapIcon className="h-8 w-8 text-gold" />,
      href: "/admin/education",
    },
    {
      title: "Certificações",
      description: "Gerenciar certificações profissionais",
      icon: <TrophyIcon className="h-8 w-8 text-gold" />,
      href: "/admin/certifications",
    },
    {
      title: "Projetos",
      description: "Adicionar ou editar projetos do portfólio",
      icon: <FolderIcon className="h-8 w-8 text-gold" />,
      href: "/admin/projects",
    },
    {
      title: "Blog",
      description: "Gerenciar artigos do blog",
      icon: <DocumentTextIcon className="h-8 w-8 text-gold" />,
      href: "/admin/posts",
    },
    {
      title: "Analytics",
      description: "Visualizar estatísticas do site",
      icon: <ChartPieIcon className="h-8 w-8 text-gold" />,
      href: "/admin/analytics",
    },
    {
      title: "SEO",
      description: "Gerenciar metadados e SEO",
      icon: <MagnifyingGlassIcon className="h-8 w-8 text-gold" />,
      href: "/admin/metadata",
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link key={index} href={card.href}>
            <Card className="h-full hover:border-gold/40 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xl font-bold">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground">{card.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

