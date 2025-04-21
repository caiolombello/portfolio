"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  User,
  Briefcase,
  GraduationCap,
  Award,
  BarChart2,
  FolderKanban,
  FileText,
  LogOut,
  Menu,
  X,
  LineChart,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/admin/profile", label: "Perfil", icon: <User size={20} /> },
    {
      path: "/admin/skills",
      label: "Habilidades",
      icon: <BarChart2 size={20} />,
    },
    {
      path: "/admin/experiences",
      label: "Experiências",
      icon: <Briefcase size={20} />,
    },
    {
      path: "/admin/education",
      label: "Educação",
      icon: <GraduationCap size={20} />,
    },
    {
      path: "/admin/certifications",
      label: "Certificações",
      icon: <Award size={20} />,
    },
    {
      path: "/admin/projects",
      label: "Projetos",
      icon: <FolderKanban size={20} />,
    },
    { path: "/admin/posts", label: "Blog", icon: <FileText size={20} /> },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: <LineChart size={20} />,
    },
    { path: "/admin/metadata", label: "SEO", icon: <Search size={20} /> },
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/40 p-4">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border/40 pt-16 md:pt-0 transition-transform duration-300 md:translate-x-0 md:static md:h-screen overflow-y-auto`}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold text-gold mb-6">Painel Admin</h1>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? "bg-secondary text-gold"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors mt-6"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}
