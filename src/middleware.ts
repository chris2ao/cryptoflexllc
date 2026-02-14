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

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers to all responses
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enforce HTTPS in production
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") !== "https"
  ) {
    const host = request.headers.get("host");
    if (host) {
      return NextResponse.redirect(
        `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`,
        301
      );
    }
  }

  return response;
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
