export interface Post {
  id: string
  title: string
  category: string
  publicationDate: string
  imageUrl: string
  summary: string
}

export const posts: Post[] = [
  {
    id: "kubernetes-hpa-custom-metrics",
    title: "Kubernetes HPA: Custom Metrics for Autoscaling",
    category: "Kubernetes",
    publicationDate: "2023-03-16",
    imageUrl: "/placeholder.svg?height=300&width=600",
    summary:
      "Unlock the Full Potential of Kubernetes Horizontal Pod Autoscaler with Custom Metrics. Learn how to scale your applications based on application-specific metrics.",
  },
  {
    id: "acelerando-transformacao-digital",
    title: "Acelerando A Transformação Digital com DevOps",
    category: "DevOps",
    publicationDate: "2023-04-16",
    imageUrl: "/placeholder.svg?height=300&width=600",
    summary:
      "Uma abordagem prática para implementar a cultura DevOps e acelerar a transformação digital na sua empresa. Descubra estratégias e ferramentas essenciais.",
  },
  {
    id: "terraform-best-practices",
    title: "Terraform Best Practices for Production",
    category: "Infrastructure as Code",
    publicationDate: "2023-05-22",
    imageUrl: "/placeholder.svg?height=300&width=600",
    summary:
      "Learn the best practices for using Terraform in production environments. From state management to module organization, this guide covers everything you need to know.",
  },
  {
    id: "monitoring-with-prometheus",
    title: "Effective Monitoring with Prometheus and Grafana",
    category: "Monitoring",
    publicationDate: "2023-06-10",
    imageUrl: "/placeholder.svg?height=300&width=600",
    summary:
      "Set up a comprehensive monitoring solution with Prometheus and Grafana. Learn how to collect metrics, create dashboards, and set up alerts for your infrastructure.",
  },
  {
    id: "aws-cost-optimization-strategies",
    title: "AWS Cost Optimization Strategies for 2023",
    category: "Cloud",
    publicationDate: "2023-07-05",
    imageUrl: "/placeholder.svg?height=300&width=600",
    summary:
      "Discover practical strategies to optimize your AWS costs without compromising performance or reliability. From right-sizing instances to using Savings Plans.",
  },
]

