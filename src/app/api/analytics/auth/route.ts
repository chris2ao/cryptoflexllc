/**
 * POST /api/analytics/auth
 * -----------------------------------------------
 * Exchanges the analytics secret for an httpOnly session cookie.
 * This replaces the old pattern of passing the secret as a query
 * parameter, which leaked it in URLs, logs, and browser history.
 *
 * Rate limit: 5 attempts per 15 minutes per IP
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getAnalyticsCookieName,
  generateAuthToken,
} from "@/lib/analytics-auth";
import { timingSafeEqual } from "crypto";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

// Rate limiter: 5 attempts per 15 minutes
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

// Zod schema for input validation
const authSchema = z.object({
  secret: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    // Check rate limit first
    const ipAddress = getClientIp(request);
    const rateLimit = await authRateLimiter.checkRateLimit(ipAddress);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter || 900),
          },
        }
      );
    }

    // Content-Type validation
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const parsed = authSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { secret } = parsed.data;
    const expectedSecret = process.env.ANALYTICS_SECRET;

    if (!expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Constant-time comparison of the secret
    let match = false;
    try {
      match =
        secret.length === expectedSecret.length &&
        timingSafeEqual(Buffer.from(secret), Buffer.from(expectedSecret));
    } catch {
      match = false;
    }

    if (!match) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = generateAuthToken(expectedSecret);
    const cookieName = getAnalyticsCookieName();

    const response = NextResponse.json({ success: true });
    response.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
