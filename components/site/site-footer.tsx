import Link from "next/link";
import {
  ArrowUp,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Rss,
} from "lucide-react";
import type { Locale } from "@/app/i18n/settings";
import { getCopy } from "@/lib/locale/copy";
import type { Person } from "@/lib/site-data";
import { ProfileAvatar } from "./profile-avatar";
import { getLocalizedInstitutionalPath } from "@/lib/navigation";

export function SiteFooter({
  locale,
  person,
  role,
}: {
  locale: Locale;
  person: Person;
  role: string;
}) {
  const copy = getCopy(locale);
  const year = new Date().getFullYear();

  const navigation = [
    { href: "/portfolio", label: copy.nav.projects },
    { href: "/#sobre", label: copy.nav.about },
    { href: "/resume", label: copy.nav.resume },
    { href: "/blog", label: copy.nav.blog },
    { href: "/contact", label: copy.nav.contact },
    { href: "/newsletter", label: copy.nav.newsletter },
  ].map((item) => ({
    ...item,
    href: item.href.includes("#")
      ? `${getLocalizedInstitutionalPath("/", locale === "pt" ? "pt" : "en")}#sobre`
      : getLocalizedInstitutionalPath(item.href, locale === "pt" ? "pt" : "en"),
  }));

  const channels = [
    {
      href: person.whatsappUrl,
      label: "WhatsApp",
      icon: MessageCircle,
      external: true,
    },
    {
      href: `mailto:${person.email}`,
      label: person.email,
      icon: Mail,
      external: false,
    },
    person.links.linkedin && {
      href: person.links.linkedin,
      label: "LinkedIn",
      icon: Linkedin,
      external: true,
    },
    person.links.github && {
      href: person.links.github,
      label: "GitHub",
      icon: Github,
      external: true,
    },
  ].filter(Boolean) as {
    href: string;
    label: string;
    icon: typeof Mail;
    external: boolean;
  }[];

  return (
    <footer
      className="relative mt-16 border-t border-border/70"
      role="contentinfo"
    >
      <div className="container grid grid-cols-1 gap-12 py-14 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="max-w-sm">
          <Link
            href={getLocalizedInstitutionalPath(
              "/",
              locale === "pt" ? "pt" : "en",
            )}
            className="inline-flex items-center gap-3 rounded-lg"
            aria-label={copy.nav.home}
          >
            <ProfileAvatar src={person.photo} size={36} />
            <span className="text-[15px] font-semibold tracking-tight">
              {person.name}
            </span>
          </Link>
          <p className="mt-4 font-serif text-xl italic leading-snug text-foreground/90">
            {copy.footer.tagline}
          </p>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {role} · {person.location.split(",")[0]}
          </p>
        </div>

        <nav aria-label={copy.footer.navigation}>
          <p className="eyebrow">{copy.footer.navigation}</p>
          <ul className="mt-4 space-y-2.5">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow">{copy.footer.elsewhere}</p>
          <ul className="mt-4 space-y-2.5">
            {channels.map(({ href, label, icon: Icon, external }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group inline-flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon
                    className="h-4 w-4 text-muted-foreground/70 transition-colors group-hover:text-brand"
                    aria-hidden="true"
                  />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container flex flex-col items-start justify-between gap-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {person.name}.{" "}
            <span className="hidden sm:inline">{copy.footer.builtWith}</span>
          </p>
          <div className="flex items-center gap-5">
            <a
              href="/feed.xml"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Rss className="h-3.5 w-3.5" aria-hidden="true" />
              {copy.footer.rss}
            </a>
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              {copy.footer.backToTop}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
