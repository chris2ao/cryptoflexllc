import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import matter from "gray-matter";
import { POST } from "./route";
import { createFile, deleteFile, getFileContents } from "@/lib/github-api";
import { getBacklogPostBySlug, getPostBySlug, type BlogPost } from "@/lib/blog";

vi.mock("@/lib/analytics-auth", () => ({ verifyApiAuth: () => true }));

vi.mock("@/lib/rate-limit", () => ({
  createRateLimiter: () => ({ checkRateLimit: async () => ({ allowed: true }) }),
  getClientIp: () => "203.0.113.7",
}));

vi.mock("@/lib/github-api", () => ({
  isGitHubApiConfigured: () => true,
  getFileContents: vi.fn(),
  createFile: vi.fn(),
  deleteFile: vi.fn(),
}));

// Keep the real toPublishedFrontmatter; stub only the filesystem lookups.
vi.mock("@/lib/blog", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/blog")>();
  return { ...actual, getBacklogPostBySlug: vi.fn(), getPostBySlug: vi.fn() };
});

const SLUG = "a-new-post";

const draft: BlogPost = {
  slug: SLUG,
  title: "A New Post",
  date: "2026-10-01",
  author: "Chris Johnson",
  readingTime: "5 min read",
  description: "",
  tags: [],
  content: "Body",
};

const DRAFT_FILE = `---
title: A New Post
date: '2026-10-01'
published: false
tags:
  - Security
---
Body text.
`;

function publish(slug = SLUG) {
  return POST(
    new NextRequest("http://localhost/api/backlog/publish", {
      method: "POST",
      body: JSON.stringify({ slug }),
    })
  );
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-16T12:00:00Z"));
  vi.mocked(getBacklogPostBySlug).mockReturnValue(draft);
  vi.mocked(getPostBySlug).mockReturnValue(undefined);
  vi.mocked(getFileContents).mockResolvedValue({ content: DRAFT_FILE, sha: "abc123" } as never);
  vi.mocked(createFile).mockResolvedValue(undefined as never);
  vi.mocked(deleteFile).mockResolvedValue(undefined as never);
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("POST /api/backlog/publish", () => {
  it("refuses a slug that a hidden live post still occupies", async () => {
    vi.mocked(getPostBySlug).mockImplementation((_slug, opts) =>
      opts?.includeUnpublished ? draft : undefined
    );

    const res = await publish();

    expect(res.status).toBe(409);
    expect(getPostBySlug).toHaveBeenCalledWith(SLUG, { includeUnpublished: true });
    expect(createFile).not.toHaveBeenCalled();
  });

  it("publishes without the draft's published flag, dated today", async () => {
    const res = await publish();

    expect(res.status).toBe(200);
    expect(createFile).toHaveBeenCalledTimes(1);
    const [blogPath, content] = vi.mocked(createFile).mock.calls[0];
    expect(blogPath).toBe(`src/content/blog/${SLUG}.mdx`);

    const { data, content: body } = matter(content as string);
    expect(data).not.toHaveProperty("published");
    expect(data.date).toBe("2026-10-16");
    expect(data.title).toBe("A New Post");
    expect(data.tags).toEqual(["Security"]);
    expect(body.trim()).toBe("Body text.");
  });

  it("still reports success when removing the backlog copy fails", async () => {
    vi.mocked(deleteFile).mockRejectedValue(new Error("GitHub 500"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await publish();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, slug: SLUG });
  });
});
