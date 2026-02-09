/**
 * POST /api/analytics/auth
 * -----------------------------------------------
 * Exchanges the analytics secret for an httpOnly session cookie.
 * This replaces the old pattern of passing the secret as a query
 * parameter, which leaked it in URLs, logs, and browser history.
 */

import { NextResponse } from "next/server";
import {
  ANALYTICS_COOKIE_NAME,
  generateAuthToken,
} from "@/lib/analytics-auth";
import { timingSafeEqual } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const secret = typeof body.secret === "string" ? body.secret : "";
    const expectedSecret = process.env.ANALYTICS_SECRET;

    if (!expectedSecret || !secret) {
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

    const response = NextResponse.json({ success: true });
    response.cookies.set(ANALYTICS_COOKIE_NAME, token, {
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
