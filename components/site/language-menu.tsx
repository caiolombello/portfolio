"use client";

import { usePathname } from "next/navigation";
import { Check, Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/language-context";
import type { Locale } from "@/app/i18n/settings";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";
import { getCopy } from "@/lib/locale/copy";
import { cn } from "@/lib/utils";

const ORDER: Locale[] = ["pt", "en"];

export function useSwitchLanguage() {
  const pathname = usePathname();
  const { language, changeLanguage, alternateLinks } = useLanguage();

  const switchTo = (next: Locale) => {
    const locale = next === "pt" ? "pt" : "en";
    changeLanguage(locale);
    const destination =
      alternateLinks?.[locale] ??
      getLocalizedInstitutionalPath(pathname, locale);
    // Reload shared server chrome together with the URL-selected content.
    window.location.assign(
      `${destination}${window.location.search}${window.location.hash}`,
    );
  };

  return { language, switchTo, pending: false };
}

export function LanguageMenu({ className }: { className?: string }) {
  const { language, switchTo, pending } = useSwitchLanguage();
  const copy = getCopy(language).language;
  const options = ORDER;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground",
          pending && "opacity-60",
          className,
        )}
        aria-label={`${copy.label}: ${copy.names[language]}`}
      >
        <Languages className="h-4 w-4" aria-hidden="true" />
        {language}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[10rem] rounded-xl p-1.5"
      >
        {options.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onSelect={() => switchTo(locale)}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2"
            aria-current={locale === language ? "true" : undefined}
          >
            <span className="flex items-center gap-2.5">
              <span className="w-5 font-mono text-[11px] uppercase text-muted-foreground">
                {locale}
              </span>
              {copy.names[locale]}
            </span>
            {locale === language && (
              <Check className="h-4 w-4 text-brand" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
