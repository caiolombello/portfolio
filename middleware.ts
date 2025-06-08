import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirecionar /blog/page/1 para /blog
  if (pathname === "/blog/page/1") {
    return NextResponse.redirect(new URL("/blog", request.url));
  }

  // Redirecionar /portfolio/page/1 para /portfolio
  if (pathname === "/portfolio/page/1") {
    return NextResponse.redirect(new URL("/portfolio", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/blog/page/1",
    "/portfolio/page/1",
  ],
}; 