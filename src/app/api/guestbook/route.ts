import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

const entrySchema = z.object({
  name: z.string().min(1).max(80),
  message: z.string().min(1).max(500),
});

const rateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
});

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ entries: [] });
  }

  try {
    const { getDb } = await import("@/lib/analytics");
    const sql = getDb();

    const entries = await sql`
      SELECT id, name, message, created_at
      FROM guestbook
      WHERE approved = true
      ORDER BY created_at DESC
      LIMIT 100
    `;

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("[guestbook] Fetch error:", error);
    return NextResponse.json({ entries: [] });
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const { allowed, retryAfter } = await rateLimiter.checkRateLimit(
    `guestbook:${ip}`
  );
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many entries. Try again in ${retryAfter} seconds.` },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const parsed = entrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { name, message } = parsed.data;

  if (!process.env.DATABASE_URL) {
    console.log(`[guestbook] Entry from ${name}: ${message} (no DB)`);
    return NextResponse.json({ success: true });
  }

  try {
    const { getDb } = await import("@/lib/analytics");
    const sql = getDb();

    await sql`
      INSERT INTO guestbook (name, message, ip, approved)
      VALUES (${name}, ${message}, ${ip}, false)
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[guestbook] Insert error:", error);
    return NextResponse.json(
      { error: "Failed to save entry" },
      { status: 500 }
    );
  }
}
