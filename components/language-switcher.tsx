"use client";

import { useLanguage } from "@/contexts/language-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageSwitcher() {
  const { language, changeLanguage, alternateLinks } = useLanguage();
  const router = useRouter();

  const handleLanguageChange = (lang: "pt" | "en") => {
    changeLanguage(lang);
    if (alternateLinks && alternateLinks[lang]) {
      router.push(alternateLinks[lang]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:text-gold transition-colors"
        >
          <Globe size={20} />
          <span className="sr-only">Mudar idioma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("pt")}
          className={language === "pt" ? "bg-secondary" : ""}
        >
          Português
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={language === "en" ? "bg-secondary" : ""}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
