"use client"

import { useState, useEffect } from "react"
import ProjectCard from "./project-card"
import CategoryFilter from "./category-filter"
import type { Project } from "@/data/projects"

export default function Portfolio() {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [activeCategory, setActiveCategory] = useState("All")
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/public/projects")
        const data = (await response.json()) as Project[]

        setProjects(data)

        // Extrair categorias únicas
        const uniqueCategories = ["All", ...new Set(data.map((project) => project.category))]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Erro ao carregar projetos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    setIsAnimating(true)

    const timer = setTimeout(() => {
      setFilteredProjects(
        activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory),
      )
      setIsAnimating(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [activeCategory, projects])

  if (loading) {
    return (
      <div className="container py-12">
        <h1 className="mb-12 text-center text-4xl font-bold text-gold">Meus Projetos</h1>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-gold rounded-full border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <h1 className="mb-12 text-center text-4xl font-bold text-gold">Meus Projetos</h1>

      <CategoryFilter categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {filteredProjects.length === 0 ? (
        <div className="mt-12 text-center text-muted-foreground">Nenhum projeto encontrado nesta categoria.</div>
      ) : (
        <div
          className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

