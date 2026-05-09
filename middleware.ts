import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const moneyFactorHosts = new Set(["moneyfactor.io", "www.moneyfactor.io"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();

  if (host && moneyFactorHosts.has(host)) {
    if (request.nextUrl.pathname === "/") {
      return NextResponse.rewrite(new URL("/moneyfactor", request.url));
    }

    if (request.nextUrl.pathname === "/sitemap.xml") {
      return NextResponse.rewrite(new URL("/moneyfactor-sitemap.xml", request.url));
    }

    if (request.nextUrl.pathname === "/robots.txt") {
      return NextResponse.rewrite(new URL("/moneyfactor-robots.txt", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sitemap.xml", "/robots.txt"],
};
