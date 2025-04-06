export interface Project {
  id: string
  title: string
  category: string
  imageUrl: string
  shortDescription: string
}

export const projects: Project[] = [
  {
    id: "aws-cost-optimization",
    title: "AWS Cost Optimization",
    category: "Cloud Management",
    imageUrl: "/placeholder.svg?height=300&width=500",
    shortDescription: "Ferramenta para otimização de custos na AWS, reduzindo despesas em até 40%.",
  },
  {
    id: "devops-self-service",
    title: "DevOps Self Service Platform",
    category: "Infrastructure Automation",
    imageUrl: "/placeholder.svg?height=300&width=500",
    shortDescription:
      "Plataforma self-service para equipes de desenvolvimento gerenciarem seus recursos de infraestrutura.",
  },
  {
    id: "load-stress-tester",
    title: "Load Stress Tester Tool",
    category: "Application Development",
    imageUrl: "/placeholder.svg?height=300&width=500",
    shortDescription: "Ferramenta para testes de carga e estresse em aplicações web e APIs.",
  },
  {
    id: "real-estate-crm",
    title: "Real Estate CRM",
    category: "Application Development",
    imageUrl: "/placeholder.svg?height=300&width=500",
    shortDescription: "Sistema CRM completo para gerenciamento de imóveis e clientes.",
  },
  {
    id: "static-website-deployment",
    title: "Easy Static Website Deployment",
    category: "CI/CD Pipeline Development",
    imageUrl: "/placeholder.svg?height=300&width=500",
    shortDescription: "Pipeline para implantação automatizada de sites estáticos com um clique.",
  },
  {
    id: "cicd-pipeline",
    title: "Applications CI/CD Pipeline",
    category: "CI/CD Pipeline Development",
    imageUrl: "/placeholder.svg?height=300&width=500",
    shortDescription: "Pipeline de CI/CD completo para aplicações web modernas.",
  },
]

export const categories = [
  "All",
  "Infrastructure Automation",
  "CI/CD Pipeline Development",
  "Cloud Management",
  "Application Development",
]

