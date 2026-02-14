/**
 * /api/comments
 * -----------------------------------------------
 * GET  ?slug=<post-slug>  — Fetch all comments for a blog post
 * POST { slug, comment, reaction, email } — Add a comment (subscriber-only)
 *
 * Comments require the poster's email to match an active subscriber.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/analytics";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

// Rate limiter: 10 requests per IP per hour for POST comments
const commentsPostRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 10,
});

// Rate limiter: 60 requests per IP per minute for GET comments
const commentsGetRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60,
});

// Zod schema for input validation
const commentSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(200),
  comment: z.string().trim().min(3).max(2000),
  email: z.string().email().max(320),
  reaction: z.enum(["up", "down"]).optional().default("up"),
});

// ---- GET: Fetch comments for a post ----

export async function GET(request: NextRequest) {
  // Check rate limit
  const ipAddress = getClientIp(request);
  const rateLimit = await commentsGetRateLimiter.checkRateLimit(ipAddress);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfter || 60),
        },
      }
    );
  }

  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug parameter." },
      { status: 400 }
    );
  }

  try {
    const sql = getDb();

    // Only return masked emails to prevent PII exposure on this public endpoint
    const comments = await sql`
      SELECT id, slug, comment, reaction,
        CONCAT(LEFT(email, 1), '***@', SPLIT_PART(email, '@', 2)) AS email,
        created_at
      FROM blog_comments
      WHERE slug = ${slug}
      ORDER BY created_at DESC
    `;

    // Count thumbs up for this post
    const thumbsResult = await sql`
      SELECT COUNT(*)::int AS thumbs_up
      FROM blog_comments
      WHERE slug = ${slug} AND reaction = 'up'
    `;

    const thumbsUp = thumbsResult[0]?.thumbs_up ?? 0;

    return NextResponse.json({ comments, thumbsUp }, {
      headers: {
        "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json(
      { error: "Failed to load comments." },
      { status: 500 }
    );
  }
}

// ---- POST: Create a comment ----

export async function POST(request: NextRequest) {
  try {
    // Content-Type validation
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    // Extract IP address first for rate limiting
    const ipAddress = getClientIp(request);

    // Check rate limit
    const rateLimit = await commentsPostRateLimiter.checkRateLimit(ipAddress);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many comment requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter || 3600),
          },
        }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { slug, comment, reaction, email } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const sql = getDb();

    // Check that the email belongs to an active subscriber
    const subscriber = await sql`
      SELECT id FROM subscribers
      WHERE email = ${normalizedEmail} AND active = TRUE
      LIMIT 1
    `;

    if (subscriber.length === 0) {
      return NextResponse.json(
        { error: "You must be a subscriber to comment. Subscribe above and try again!" },
        { status: 403 }
      );
    }

    // Insert the comment
    const result = await sql`
      INSERT INTO blog_comments (slug, comment, reaction, email)
      VALUES (${slug}, ${comment}, ${reaction}, ${normalizedEmail})
      RETURNING id, slug, comment, reaction,
        CONCAT(LEFT(email, 1), '***@', SPLIT_PART(email, '@', 2)) AS email,
        created_at
    `;

    return NextResponse.json({ ok: true, comment: result[0] });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
