import { notFound } from "next/navigation"
import { getAllProjects } from "@/lib/data"

// Recebe lang e page dos params
export default async function PortfolioPage({ params }: { params: { lang: string; page: string } }) {
  const { lang, page } = params
  const pageNum = parseInt(page)
  if (isNaN(pageNum) || pageNum < 1) {
    notFound()
  }

  const projects = getAllProjects()
  const itemsPerPage = 9
  const startIndex = (pageNum - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProjects = projects.slice(startIndex, endIndex)

  if (paginatedProjects.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      {paginatedProjects.map(project => (
        <div key={project.id}>
          <h2>{lang === "en" ? project.title_en : project.title_pt}</h2>
          <p>{lang === "en" ? project.shortDescription_en : project.shortDescription_pt}</p>
        </div>
      ))}
    </div>
  )
} 