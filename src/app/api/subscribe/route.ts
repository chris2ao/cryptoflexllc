/**
 * POST /api/subscribe
 * -----------------------------------------------
 * Adds an email address to the subscribers table.
 * Validates format and handles duplicates gracefully.
 * Captures IP address and Vercel geolocation headers.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { isValidEmail } from "@/lib/subscribers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email: string = (body.email ?? "").toLowerCase().trim();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Extract IP address
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : realIp || "";

    // Extract Vercel geolocation headers
    const country = decodeURIComponent(
      request.headers.get("x-vercel-ip-country") || "Unknown"
    );
    const city = decodeURIComponent(
      request.headers.get("x-vercel-ip-city") || "Unknown"
    );
    const region = decodeURIComponent(
      request.headers.get("x-vercel-ip-country-region") || "Unknown"
    );

    const sql = getDb();

    // Upsert: if they previously unsubscribed, reactivate.
    // Always update geo data so we have the latest info.
    await sql`
      INSERT INTO subscribers (email, active, ip_address, country, city, region)
      VALUES (${email}, TRUE, ${ipAddress}, ${country}, ${city}, ${region})
      ON CONFLICT (email)
      DO UPDATE SET active = TRUE, subscribed_at = NOW(),
        ip_address = ${ipAddress}, country = ${country},
        city = ${city}, region = ${region}
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
