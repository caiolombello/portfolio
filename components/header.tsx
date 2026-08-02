"use client";

import Link from "next/link";
import MobileMenu from "./mobile-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import LanguageSwitcher from "./language-switcher";
import { useLanguage } from "@/contexts/language-context";
import { useSiteConfig } from "@/hooks/use-site-config";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getMainNavigationItems } from "@/lib/navigation";
import { isPortfolioEnabled } from "@/lib/site-features";
import { useProfile } from "@/contexts/profile-context";

export default function Header() {
  const { t, language } = useLanguage();
  const { config } = useSiteConfig();
  const profile = useProfile();
  const pathname = usePathname();

  const portfolioEnabled = isPortfolioEnabled(config);
  const navItems = getMainNavigationItems(
    t,
    { portfolioEnabled },
    language === "en" ? "en" : "pt",
  );

  const currentProfile = profile?.[language === "en" ? "en" : "pt"] ?? {
    name: config.site.shortName,
    title:
      config.site.title.split(" - ")[1] ||
      (language === "en" ? "DevOps Engineer" : "Engenheiro DevOps"),
    location: config.site.location,
    about: config.site.description,
  };
  const navigationLabel =
    language === "en" ? "Main navigation" : "Navegação principal";
  const utilityLabel =
    language === "en" ? "Utility navigation" : "Navegação auxiliar";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex min-h-14 items-center gap-2 sm:min-h-16 sm:gap-4">
        <MobileMenu
          name={currentProfile.name}
          title={currentProfile.title}
          imageUrl="/api/profile-image"
          showImage
          portfolioEnabled={portfolioEnabled}
        />

        <Link
          href={language === "en" ? "/en" : "/"}
          className="group flex min-w-0 items-center gap-2 sm:gap-3"
          aria-label={currentProfile.name}
        >
          <div className="relative hidden h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gold/40 bg-secondary sm:block">
            <Image
              src="/api/profile-image"
              alt=""
              fill
              className="object-cover"
              sizes="36px"
              priority
            />
          </div>
          <span
            className="max-w-28 truncate text-sm font-semibold tracking-tight transition-colors group-hover:text-gold sm:max-w-none"
            suppressHydrationWarning
          >
            {currentProfile.name}
          </span>
          <span
            className="hidden truncate text-xs text-muted-foreground lg:block"
            suppressHydrationWarning
          >
            {currentProfile.title}
          </span>
        </Link>

        <nav
          className="ml-auto hidden items-center gap-6 text-sm font-medium md:flex"
          role="navigation"
          aria-label={navigationLabel}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative py-2 text-muted-foreground transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:text-foreground hover:after:scale-x-100",
                pathname === item.href &&
                  "font-semibold text-foreground after:scale-x-100",
              )}
              aria-current={pathname === item.href ? "page" : undefined}
              suppressHydrationWarning
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1 md:ml-6">
          <nav
            className="flex items-center gap-2"
            role="navigation"
            aria-label={utilityLabel}
            suppressHydrationWarning
          >
            <LanguageSwitcher />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
