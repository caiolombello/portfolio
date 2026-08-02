export interface MainNavigationOptions {
  portfolioEnabled: boolean;
}

export interface MainNavigationItem {
  href: string;
  label: string;
}

export type InstitutionalLocale = "pt" | "en";

const localizedInstitutionalPages = new Set([
  "/",
  "/resume",
  "/blog",
  "/newsletter",
  "/contact",
  "/portfolio",
]);

export function getLocalizedInstitutionalPath(
  pathname: string,
  locale: InstitutionalLocale,
): string {
  const pathWithoutEnglishPrefix =
    pathname === "/en"
      ? "/"
      : pathname.startsWith("/en/")
        ? pathname.slice(3)
        : pathname;
  const isInstitutionalPage =
    localizedInstitutionalPages.has(pathWithoutEnglishPrefix) ||
    /^\/(?:blog|portfolio)\/page\/\d+$/.test(pathWithoutEnglishPrefix);

  if (!isInstitutionalPage) return pathname;
  if (locale === "pt") return pathWithoutEnglishPrefix;
  return pathWithoutEnglishPrefix === "/"
    ? "/en"
    : `/en${pathWithoutEnglishPrefix}`;
}

export function getMainNavigationItems(
  translate: (key: string) => string,
  { portfolioEnabled }: MainNavigationOptions,
  locale: InstitutionalLocale = "pt",
): MainNavigationItem[] {
  return [
    { href: "/", label: translate("nav.about") },
    { href: "/resume", label: translate("nav.resume") },
    ...(portfolioEnabled
      ? [{ href: "/portfolio", label: translate("nav.projects") }]
      : []),
    { href: "/blog", label: translate("nav.blog") },
    { href: "/newsletter", label: translate("nav.newsletter") },
    { href: "/contact", label: translate("nav.contact") },
  ].map((item) => ({
    ...item,
    href: getLocalizedInstitutionalPath(item.href, locale),
  }));
}
