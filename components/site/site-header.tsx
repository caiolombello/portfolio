"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/language-context";
import { getCopy } from "@/lib/locale/copy";
import { cn } from "@/lib/utils";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";
import { ProfileAvatar } from "./profile-avatar";
import { ThemeToggle } from "./theme-toggle";
import { LanguageMenu, useSwitchLanguage } from "./language-menu";

interface SiteHeaderProps {
  name: string;
  role: string;
  photo: string;
}

export function SiteHeader({ name, role, photo }: SiteHeaderProps) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const copy = getCopy(language);
  const locale = language === "pt" ? "pt" : "en";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { href: "/portfolio", label: copy.nav.projects },
    { href: "/#sobre", label: copy.nav.about },
    { href: "/resume", label: copy.nav.resume },
    { href: "/blog", label: copy.nav.blog },
    { href: "/newsletter", label: copy.nav.newsletter },
  ].map((item) => ({
    ...item,
    href: item.href.includes("#")
      ? `${getLocalizedInstitutionalPath("/", locale)}#sobre`
      : getLocalizedInstitutionalPath(item.href, locale),
  }));

  const isActive = (href: string) =>
    !href.includes("#") &&
    (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-border/70 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65"
          : "border-transparent bg-background/0",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href={getLocalizedInstitutionalPath("/", locale)}
          className="group flex min-w-0 items-center gap-3 rounded-lg"
          aria-label={`${name} — ${copy.nav.home}`}
        >
          <ProfileAvatar
            src={photo}
            size={36}
            status
            priority
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[15px] font-semibold tracking-tight">
              {name}
            </span>
            <span className="hidden truncate font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground sm:block">
              {role}
            </span>
          </span>
        </Link>

        <nav
          aria-label={copy.nav.primary}
          className="hidden items-center gap-0.5 rounded-full border border-border/70 bg-card/60 p-1 shadow-sm backdrop-blur lg:flex"
        >
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageMenu className="hidden sm:inline-flex" />
          <ThemeToggle />
          <Link
            href={getLocalizedInstitutionalPath("/contact", locale)}
            aria-current={
              isActive(getLocalizedInstitutionalPath("/contact", locale))
                ? "page"
                : undefined
            }
            className="ml-1 hidden h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-[filter,transform] hover:brightness-105 active:scale-[0.98] lg:inline-flex"
          >
            {copy.nav.contact}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <MobileNav
            items={[
              ...items,
              {
                href: getLocalizedInstitutionalPath("/contact", locale),
                label: copy.nav.contact,
              },
            ]}
            name={name}
            photo={photo}
          />
        </div>
      </div>
    </header>
  );
}

function MobileNav({
  items,
  name,
  photo,
}: {
  items: { href: string; label: string }[];
  name: string;
  photo: string;
}) {
  const pathname = usePathname();
  const { language, switchTo } = useSwitchLanguage();
  const copy = getCopy(language);

  return (
    <Sheet>
      <SheetTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        aria-label={copy.nav.openMenu}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="right"
        aria-describedby={undefined}
        className="flex w-[86vw] max-w-sm flex-col gap-0 border-border/70 p-0 [&>button:last-child]:hidden"
      >
        <div className="flex h-16 items-center justify-between border-b border-border/70 px-5">
          <SheetTitle className="flex items-center gap-3 text-base">
            <ProfileAvatar src={photo} size={32} status />
            {name}
          </SheetTitle>
          <SheetClose
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label={copy.nav.closeMenu}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </SheetClose>
        </div>

        <nav aria-label={copy.nav.primary} className="flex flex-col p-3">
          {items.map((item, index) => {
            const active =
              !item.href.includes("#") && pathname.startsWith(item.href);
            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-baseline gap-4 rounded-xl px-3 py-3.5 text-2xl font-semibold tracking-tight transition-colors",
                    active
                      ? "bg-accent text-foreground"
                      : "text-foreground/80 hover:bg-accent",
                  )}
                >
                  <span className="font-mono text-xs font-normal text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border/70 p-5">
          <p className="eyebrow mb-3">{copy.language.label}</p>
          <div
            className="grid grid-cols-2 gap-2"
            role="group"
            aria-label={copy.language.label}
          >
            {(["pt", "en"] as const).map((locale) => (
              <button
                key={locale}
                type="button"
                onClick={() => switchTo(locale)}
                aria-pressed={locale === language}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  locale === language
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {copy.language.names[locale]}
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
