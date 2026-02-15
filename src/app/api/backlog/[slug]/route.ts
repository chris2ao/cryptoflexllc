import { NextRequest, NextResponse } from "next/server";
import { verifyApiAuth } from "@/lib/analytics-auth";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import {
  isGitHubApiConfigured,
  getFileContents,
  deleteFile,
} from "@/lib/github-api";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

const slugRegex = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const rateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,
});

export async function DELETE(request: NextRequest, context: RouteContext) {
  // Step 1: Verify authentication
  if (!verifyApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Step 1b: Rate limit check
  const ip = getClientIp(request);
  const rateCheck = await rateLimiter.checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rateCheck.retryAfter || 60) } }
    );
  }

  // Step 2: Extract slug from params
  const { slug } = await context.params;

  // Step 3: Validate slug format
  if (!slugRegex.test(slug)) {
    return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
  }

  // Step 4: Check GitHub API configuration
  if (!isGitHubApiConfigured()) {
    return NextResponse.json(
      { error: "GitHub API not configured" },
      { status: 503 }
    );
  }

  try {
    // Step 5: Get file SHA from GitHub
    const backlogPath = `src/content/backlog/${slug}.mdx`;
    const fileData = await getFileContents(backlogPath);
    const fileSha = fileData.sha;

    // Step 6: Delete file from backlog
    await deleteFile(backlogPath, fileSha, `backlog: delete ${slug}`);

    // Step 7: Return success
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting backlog post:", error);
    return NextResponse.json(
      { error: "Failed to delete backlog post" },
      { status: 500 }
    );
  }
}
