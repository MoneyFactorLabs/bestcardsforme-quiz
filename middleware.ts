import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const moneyFactorHosts = new Set(["moneyfactor.io", "www.moneyfactor.io"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();

  if (host && moneyFactorHosts.has(host) && request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL("/moneyfactor", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
