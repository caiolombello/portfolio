"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
  },
  {
    title: "Posts",
    href: "/admin/posts",
  },
  {
    title: "Projetos",
    href: "/admin/projects",
  },
  {
    title: "Metadados",
    href: "/admin/metadata",
  },
  {
    title: "Configurações",
    href: "/admin/settings",
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-lg font-bold">
              Admin
            </Link>
            <div className="hidden md:flex md:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Voltar ao Site
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 