import { NextResponse, type NextRequest } from "next/server";
import { detectRequestLocale } from "@/lib/request-locale";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirecionar /blog/page/1 para /blog
  if (pathname === "/blog/page/1" || pathname === "/en/blog/page/1") {
    return NextResponse.redirect(
      new URL(pathname.startsWith("/en/") ? "/en/blog" : "/blog", request.url),
    );
  }

  // Redirecionar /portfolio/page/1 para /portfolio
  if (
    pathname === "/portfolio/page/1" ||
    pathname === "/en/portfolio/page/1"
  ) {
    return NextResponse.redirect(
      new URL(
        pathname.startsWith("/en/") ? "/en/portfolio" : "/portfolio",
        request.url,
      ),
    );
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "x-site-locale",
    detectRequestLocale(pathname, request.cookies.get("NEXT_LOCALE")?.value),
  );

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/",
    "/resume",
    "/blog/:path*",
    "/contact",
    "/portfolio/:path*",
    "/en/:path*",
  ],
};
