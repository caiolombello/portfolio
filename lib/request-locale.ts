export type SiteLocale = "pt" | "en";

export function detectRequestLocale(
  pathname: string,
  _cookieLocale?: string,
): SiteLocale {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (/\/blog\/[^/]+\.en(?:\/|$)/.test(pathname)) return "en";
  if (/\/blog\/[^/]+\.pt(?:\/|$)/.test(pathname)) return "pt";
  return "pt";
}
