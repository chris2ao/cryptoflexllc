import { describe, it, expect, vi, beforeEach } from "vitest";

const tag = vi.fn();
vi.mock("@/lib/analytics", () => ({ getDb: () => tag }));
vi.mock("@/lib/blog", () => ({
  getAllPosts: () => [
    { slug: "a", title: "A", date: new Date().toISOString().slice(0, 10) },
    { slug: "old", title: "Old", date: "2001-01-01" },
  ],
}));

const fetchRecentCommits = vi.fn();
const fetchDeployments = vi.fn();
const isVercelApiConfigured = vi.fn();
vi.mock("@/lib/github-activity", async (orig) => ({
  ...(await orig<typeof import("@/lib/github-activity")>()),
  fetchRecentCommits: (...a: unknown[]) => fetchRecentCommits(...a),
}));
vi.mock("@/lib/vercel-api", () => ({
  fetchDeployments: (...a: unknown[]) => fetchDeployments(...a),
  isVercelApiConfigured: () => isVercelApiConfigured(),
}));

import { loadOverview } from "./overview";

const text = () => tag.mock.calls.map((c) => (c[0] as string[]).join("?"));

describe("loadOverview", () => {
  beforeEach(() => {
    tag.mockReset();
    tag.mockResolvedValue([]);
    fetchRecentCommits.mockReset().mockResolvedValue([]);
    fetchDeployments.mockReset().mockResolvedValue([]);
    isVercelApiConfigured.mockReset().mockReturnValue(true);
  });

  it("builds the shipping stats from commits and deployments", async () => {
    const day = 86_400_000;
    const iso = (ago: number) => new Date(Date.now() - ago).toISOString();
    fetchRecentCommits.mockResolvedValue([
      { sha: "a", message: "m", date: iso(1 * day) },
      { sha: "b", message: "m", date: iso(3 * day) },
      { sha: "c", message: "m", date: iso(10 * day) },
    ]);
    fetchDeployments.mockResolvedValue([
      { state: "READY", createdAt: Date.now() - day, commitMessage: "latest" },
      { state: "ERROR", createdAt: Date.now() - 9 * day, commitMessage: "old" },
    ]);
    const { shipping } = await loadOverview(30, "humans");
    expect(shipping).toEqual({
      commits7d: 2,
      commits14d: 3,
      deploys7d: 1,
      lastDeploy: { state: "READY", createdAt: expect.any(Number), commitMessage: "latest" },
    });
    expect(fetchRecentCommits.mock.calls[0][0]).toBe("chris2ao/cryptoflexllc");
  });

  it("returns zeros and null when the external calls fail", async () => {
    fetchRecentCommits.mockRejectedValue(new Error("boom"));
    fetchDeployments.mockRejectedValue(new Error("boom"));
    const { shipping } = await loadOverview(30, "humans");
    expect(shipping).toEqual({ commits7d: 0, commits14d: 0, deploys7d: 0, lastDeploy: null });
  });

  it("skips deployments when the Vercel API is not configured", async () => {
    isVercelApiConfigured.mockReturnValue(false);
    await loadOverview(30, "humans");
    expect(fetchDeployments).not.toHaveBeenCalled();
  });

  it("applies the scope predicate and the previous window", async () => {
    await loadOverview(30, "humans");
    expect(text().some((t) => t.includes("traffic_class = "))).toBe(true);
    expect(text().some((t) => t.includes("2 * "))).toBe(true);
    expect(tag.mock.calls.some((c) => c.slice(1).includes("human"))).toBe(true);
  });

  it("binds null for the all scope", async () => {
    await loadOverview(30, "all");
    expect(tag.mock.calls.some((c) => c.slice(1).includes(null))).toBe(true);
  });

  it("returns numeric kpi windows and in-range publish dates", async () => {
    tag.mockResolvedValue([{ current: 5, previous: 2, total_views: 5 }]);
    const data = await loadOverview(30, "humans");
    expect(typeof data.kpis.views.current).toBe("number");
    expect(typeof data.kpis.views.previous).toBe("number");
    expect(data.publishDates).toHaveLength(1);
  });

  it("falls back to zeros when every query fails", async () => {
    tag.mockImplementation(() => Promise.reject(new Error("boom")));
    const data = await loadOverview(30, "humans");
    expect(data.kpis.views).toEqual({ current: 0, previous: 0 });
    expect(data.kpis.pending).toBe(0);
    expect(data.trend).toEqual([]);
  });
});
