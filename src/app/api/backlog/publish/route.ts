import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import matter from "gray-matter";
import { verifyApiAuth } from "@/lib/analytics-auth";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import {
  isGitHubApiConfigured,
  getFileContents,
  createFile,
  deleteFile,
} from "@/lib/github-api";
import { getBacklogPostBySlug, getPostBySlug } from "@/lib/blog";

const rateLimiter = createRateLimiter({
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

  // Step 6: Check for collision in live blog
  const existingPost = getPostBySlug(slug);
  if (existingPost) {
    return NextResponse.json(
      { error: "Post already exists in blog" },
      { status: 409 }
    );
  }

  try {
    // Step 7: Get file content and SHA from GitHub
    const backlogPath = `src/content/backlog/${slug}.mdx`;
    const fileData = await getFileContents(backlogPath);
    const fileContent = fileData.content;
    const fileSha = fileData.sha;

    // Step 8: Parse frontmatter and update date
    const { data, content } = matter(fileContent);
    data.date = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD
    const updatedContent = matter.stringify(content, data);

    // Step 9: Create file in blog
    const blogPath = `src/content/blog/${slug}.mdx`;
    await createFile(blogPath, updatedContent, `publish: ${slug}`);

    // Step 10: Delete file from backlog
    // If this fails, the post is still published (just needs manual cleanup)
    try {
      await deleteFile(
        backlogPath,
        fileSha,
        `publish: remove ${slug} from backlog`
      );
    } catch (deleteError) {
      console.error("Failed to delete backlog file after publish:", deleteError);
      // Still return success since the post was published
    }

    // Step 11: Return success
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
