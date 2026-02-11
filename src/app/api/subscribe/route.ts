/**
 * POST /api/subscribe
 * -----------------------------------------------
 * Adds an email address to the subscribers table.
 * Validates format and handles duplicates gracefully.
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

    const sql = getDb();

    // Upsert: if they previously unsubscribed, reactivate
    await sql`
      INSERT INTO subscribers (email, active)
      VALUES (${email}, TRUE)
      ON CONFLICT (email)
      DO UPDATE SET active = TRUE, subscribed_at = NOW()
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
