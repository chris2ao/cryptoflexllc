import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import matter from "gray-matter";
import { parseFrontmatter } from "@/lib/frontmatter";
import { verifyApiAuth } from "@/lib/analytics-auth";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import {
  isGitHubApiConfigured,
  getFileContents,
  moveFile,
} from "@/lib/github-api";
import { getBacklogPostBySlug, getPostBySlug, toPublishedFrontmatter } from "@/lib/blog";

const rateLimiter = createRateLimiter({
  name: "backlog-publish",
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,
});

const slugSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/),
});

export async function POST(request: NextRequest) {
  // Step 1: Verify authentication
  if (!verifyApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Step 2: Rate limit check
  const ip = getClientIp(request);
  const rateCheck = await rateLimiter.checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfter || 60) },
      }
    );
  }

  // Step 3: Parse and validate request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validation = slugSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid slug format" },
      { status: 400 }
    );
  }

  const { slug } = validation.data;

  // Step 4: Check GitHub API configuration
  if (!isGitHubApiConfigured()) {
    return NextResponse.json(
      { error: "GitHub API not configured" },
      { status: 503 }
    );
  }

  // Step 5: Verify post exists in backlog
  const backlogPost = getBacklogPostBySlug(slug);
  if (!backlogPost) {
    return NextResponse.json(
      { error: "Post not found in backlog" },
      { status: 404 }
    );
  }

  // Step 6: Check for collision in live blog (hidden posts still occupy the slug)
  const existingPost = getPostBySlug(slug, { includeUnpublished: true });
  if (existingPost) {
    return NextResponse.json(
      { error: "Post already exists in blog" },
      { status: 409 }
    );
  }

  try {
    // Step 7: Get the draft's current content from GitHub
    const backlogPath = `src/content/backlog/${slug}.mdx`;
    const fileData = await getFileContents(backlogPath);
    const fileContent = fileData.content;

    // Step 8: Parse frontmatter, stamp today's date (YYYY-MM-DD), and drop any
    // `published` flag so a stale draft value cannot hide the live post
    const { data, content } = parseFrontmatter(fileContent);
    const today = new Date().toISOString().split("T")[0];
    const updatedContent = matter.stringify(content, toPublishedFrontmatter(data, today));

    // Step 9: Add the post to the blog and remove it from the backlog in one
    // commit. Two commits meant two Vercel deployments for every publish.
    const blogPath = `src/content/blog/${slug}.mdx`;
    await moveFile(backlogPath, blogPath, updatedContent, `publish: ${slug}`);

    // Step 10: Return success
    return NextResponse.json({ success: true, slug }, { status: 200 });
  } catch (error) {
    console.error("Error publishing post:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to publish post: ${detail}` },
      { status: 500 }
    );
  }
}
