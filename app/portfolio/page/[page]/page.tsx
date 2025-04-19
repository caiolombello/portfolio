import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Project } from "@/types/project"
import { PortfolioGrid } from "@/components/portfolio-grid"
import { getAllProjects } from "@/lib/data"

type PageProps = {
  params: Promise<{
    page: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params
  return {
    title: `Portfólio - Página ${page}`,
  }
}

export default async function PortfolioPage({ params }: PageProps) {
  const { page } = await params
  const pageNum = parseInt(page)
  if (isNaN(pageNum) || pageNum < 1) {
    notFound()
  }

  const projects: Project[] = getAllProjects()
  const itemsPerPage = 9
  const startIndex = (pageNum - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProjects = projects.slice(startIndex, endIndex)

  if (paginatedProjects.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <PortfolioGrid projects={paginatedProjects} />
    </div>
  )
} 