/**
 * /api/comments
 * -----------------------------------------------
 * GET  ?slug=<post-slug>  — Fetch all comments for a blog post
 * POST { slug, comment, reaction, email } — Add a comment (subscriber-only)
 *
 * Comments require the poster's email to match an active subscriber.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { isValidEmail } from "@/lib/subscribers";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

// Rate limiter: 10 requests per IP per hour for comments
const commentsRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 10,
});

// ---- GET: Fetch comments for a post ----

export async function GET(request: NextRequest) {
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
        CONCAT(LEFT(email, 1), '***@', SPLIT_PART(email, '@', 2)) AS email_masked,
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

    return NextResponse.json({ comments, thumbsUp });
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
    // Extract IP address first for rate limiting
    const ipAddress = getClientIp(request);

    // Check rate limit
    const rateLimit = commentsRateLimiter.checkRateLimit(ipAddress);
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

    const body = await request.json();
    const slug: string = (body.slug ?? "").trim();
    const comment: string = (body.comment ?? "").trim();
    const reaction: string = (body.reaction ?? "up").trim();
    const email: string = (body.email ?? "").toLowerCase().trim();

    // Validate required fields
    if (!slug) {
      return NextResponse.json(
        { error: "Missing post slug." },
        { status: 400 }
      );
    }

    if (!comment || comment.length < 2) {
      return NextResponse.json(
        { error: "Comment must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (comment.length > 2000) {
      return NextResponse.json(
        { error: "Comment must be 2000 characters or less." },
        { status: 400 }
      );
    }

    if (!["up", "down"].includes(reaction)) {
      return NextResponse.json(
        { error: "Reaction must be 'up' or 'down'." },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Check that the email belongs to an active subscriber
    const subscriber = await sql`
      SELECT id FROM subscribers
      WHERE email = ${email} AND active = TRUE
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
      VALUES (${slug}, ${comment}, ${reaction}, ${email})
      RETURNING id, slug, comment, reaction, email, created_at
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
