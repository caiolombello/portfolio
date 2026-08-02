"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getMainNavigationItems } from "@/lib/navigation";

interface MobileMenuProps {
  name: string;
  title: string;
  imageUrl?: string;
  showImage?: boolean;
  portfolioEnabled?: boolean;
}

export default function MobileMenu({
  name,
  title,
  imageUrl,
  showImage = true,
  portfolioEnabled = true,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);

  const navItems = getMainNavigationItems(
    t,
    { portfolioEnabled },
    language === "en" ? "en" : "pt",
  );

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="-ml-2 h-11 w-11 md:hidden"
            size="icon"
            aria-label={language === "en" ? "Open menu" : "Abrir menu"}
            suppressHydrationWarning
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[min(90vw,380px)] overflow-y-auto border-r-border/70 bg-background p-5 sm:p-6"
        >
          <SheetTitle className="sr-only">
            {language === "en" ? "Main navigation" : "Navegação principal"}
          </SheetTitle>
          <div
            className="flex min-h-full flex-col gap-7 py-3 sm:gap-8 sm:py-4"
            suppressHydrationWarning
          >
            <div className="flex items-center gap-3 border-b border-border/70 pb-6">
              {showImage && imageUrl && (
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-gold/40">
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              )}
              <div className="min-w-0 space-y-1">
                <h4
                  className="truncate text-sm font-semibold"
                  suppressHydrationWarning
                >
                  {name}
                </h4>
                <p
                  className="text-sm text-muted-foreground"
                  suppressHydrationWarning
                >
                  {title}
                </p>
              </div>
            </div>
            <nav
              className="flex flex-col gap-1.5"
              aria-label={
                language === "en" ? "Main navigation" : "Navegação principal"
              }
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "min-h-12 rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-secondary hover:text-gold",
                    pathname === item.href
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground",
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                  suppressHydrationWarning
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
