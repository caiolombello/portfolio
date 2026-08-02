import "server-only";

import { cookies, headers } from "next/headers";

import { detectRequestLocale, type SiteLocale } from "./request-locale";

export async function getCurrentRequestLocale(): Promise<SiteLocale> {
  const requestHeaders = await headers();
  const localeFromProxy = requestHeaders.get("x-site-locale");
  if (localeFromProxy === "pt" || localeFromProxy === "en") {
    return localeFromProxy;
  }

  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value;
  return detectRequestLocale("/", cookieLocale);
}
