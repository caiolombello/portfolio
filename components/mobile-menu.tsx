"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  name: string;
  title: string;
  imageUrl?: string;
  showImage?: boolean;
}

export default function MobileMenu({
  name,
  title,
  imageUrl,
  showImage = true,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { href: "/", label: t("nav.about") },
    { href: "/resume", label: t("nav.resume") },
    { href: "/portfolio", label: t("nav.projects") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="md:hidden"
            size="icon"
            aria-label="Open menu"
            suppressHydrationWarning
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col space-y-4 py-4" suppressHydrationWarning>
            <div className="flex items-center space-x-2">
              {showImage && imageUrl && (
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              )}
              <div className="space-y-1">
                <h4 className="text-sm font-semibold" suppressHydrationWarning>{name}</h4>
                <p className="text-sm text-muted-foreground" suppressHydrationWarning>{title}</p>
              </div>
            </div>
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleMenu}
                  className={cn(
                    "text-lg transition-colors hover:text-gold",
                    pathname === item.href
                      ? "text-foreground font-bold"
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
