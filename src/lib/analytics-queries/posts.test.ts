import { describe, it, expect, vi, beforeEach } from "vitest";

const tag = vi.fn();
vi.mock("@/lib/analytics", () => ({ getDb: () => tag }));
vi.mock("@/lib/blog", () => ({
  getAllPosts: () => [{ slug: "first-post", title: "First Post", date: "2026-01-01" }],
}));

import { loadPostPerformance } from "./posts";

const row = (page_path: string) => ({
  page_path, views: 10, readers: 4, read_through_pct: 40, median_seconds: 90,
  subscribes: 1, comments: 2,
});

describe("loadPostPerformance", () => {
  beforeEach(() => {
    tag.mockReset();
  });

  it("maps a known slug to its title", async () => {
    tag.mockResolvedValue([row("/blog/first-post")]);
    const rows = await loadPostPerformance(30, "humans");
    expect(rows[0].title).toBe("First Post");
    expect(rows[0].views).toBe(10);
  });

  it("windows subscribes and comments like the other columns", async () => {
    tag.mockResolvedValue([]);
    await loadPostPerformance(30, "humans");
    const text = (tag.mock.calls[0][0] as string[]).join("?");
    expect(text).toContain("s.subscribed_at > NOW() - INTERVAL '1 day' * ?");
    expect(text).toContain("c.created_at > NOW() - INTERVAL '1 day' * ?");
    expect(tag.mock.calls[0].filter((v: unknown) => v === 30).length).toBeGreaterThanOrEqual(6);
  });

  it("keeps the path for an unknown slug", async () => {
    tag.mockResolvedValue([row("/blog/ghost")]);
    const rows = await loadPostPerformance(30, "all");
    expect(rows[0].title).toBe("/blog/ghost");
  });

  it("returns [] on failure", async () => {
    tag.mockImplementation(() => Promise.reject(new Error("x")));
    expect(await loadPostPerformance(30, "humans")).toEqual([]);
  });
});
