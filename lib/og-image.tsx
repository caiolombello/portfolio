import type { SiteLocale } from "./request-locale";
import { getSiteConfig } from "./config-server";
import { renderOgImage, type OgTheme } from "./og/render";

export { OG_SIZE, OG_CONTENT_TYPE } from "./og/render";

interface OgImageOptions {
  eyebrow: string;
  title: string;
  description?: string;
  tags?: string[];
  path?: string;
  locale?: SiteLocale;
  theme?: OgTheme;
}

/** Retains the original route API while rendering with local redesign assets. */
export function createOgImage({
  eyebrow, title, description, tags = [], path = "/", locale, theme,
}: OgImageOptions) {
  const host = new URL(getSiteConfig().site.url).host;
  return renderOgImage({
    locale: locale ?? (path === "/en" || path.startsWith("/en/") ? "en" : "pt"),
    eyebrow,
    title,
    subtitle: description,
    chips: tags,
    url: `${host}${path === "/" ? "" : path}`,
    theme,
  });
}
