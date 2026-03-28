/**
 * Edge Middleware for Request Filtering and Security
 * ------------------------------------------------
 * Runs on every request at the edge before reaching Next.js.
 * Provides defense-in-depth by blocking suspicious traffic
 * and enforcing security policies.
 *
 * CORS Policy:
 * ------------------------------------------------
 * This application enforces a same-origin policy by default.
 * No CORS headers are added, which means browsers will only
 * allow requests from the same origin (cryptoflexllc.com).
 * Cross-origin requests to API routes will be blocked by the
 * browser unless explicitly allowed via Access-Control-Allow-Origin.
 */

import { NextRequest, NextResponse } from "next/server";

// Patterns that are clearly bot probes or garbage (from GSC 404 report)
const GARBAGE_PATHS = [
  "/dev/tty",
  "/doctor",
  "/some/path",
  "/wrap-up",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host");

  // Block known garbage paths early with 404 (saves server resources)
  if (GARBAGE_PATHS.includes(pathname)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Block regex-like paths that bots/scanners probe
  if (pathname === "/*" || pathname === "/(.*)" || pathname.startsWith("/c/Users")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Redirect non-www to www in production (also upgrades to HTTPS in one hop)
  if (process.env.NODE_ENV === "production" && host === "cryptoflexllc.com") {
    return NextResponse.redirect(
      `https://www.cryptoflexllc.com${pathname}${request.nextUrl.search}`,
      301
    );
  }

  // Prevent indexing of Vercel preview/deployment URLs
  if (host && host.endsWith(".vercel.app")) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  // Enforce HTTPS in production
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") !== "https"
  ) {
    if (host) {
      return NextResponse.redirect(
        `https://${host}${pathname}${request.nextUrl.search}`,
        301
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
