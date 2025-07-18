"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useSiteConfig } from "@/hooks/use-site-config";

export default function DynamicTitle() {
  const { language } = useLanguage();
  const { config, loading: configLoading } = useSiteConfig();
  const [profile, setProfile] = useState({
    name: config?.site?.author || "Caio Lombello Vendramini Barbieri",
    title: config?.site.title?.split(' - ')[1] || "Engenheiro DevOps",
  });

  useEffect(() => {
    // Função para buscar os dados do perfil
    async function fetchProfile() {
      try {
        const response = await fetch("/api/public/profile");
        if (response.ok) {
          const data = await response.json();
          if (data && data[language]) {
            const fullName = data[language].name
              .split(" ")
              .slice(0, 2)
              .join(" ");
            const mainTitle = data[language].title.split("|")[0].trim();

            setProfile({
              name: fullName,
              title: mainTitle,
            });

            // Atualizar o título da página
            document.title = `${fullName} | ${mainTitle}`;
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
      }
    }

    fetchProfile();
  }, [language]);

  // Este componente não renderiza nada visualmente
  return null;
}
