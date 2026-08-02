"use client";

import { useLanguage } from "@/contexts/language-context";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";

export default function LanguageSwitcher() {
  const { language, changeLanguage, alternateLinks } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: "pt" | "en") => {
    changeLanguage(lang);
    const destination =
      alternateLinks?.[lang] ?? getLocalizedInstitutionalPath(pathname, lang);
    if (destination !== pathname) router.push(destination);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 min-w-10 gap-1.5 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:text-gold"
          aria-label={language === "en" ? "Change language" : "Mudar idioma"}
        >
          <Globe size={16} aria-hidden="true" />
          <span className="hidden min-[360px]:inline">{language}</span>
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
