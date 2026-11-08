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
      { state: "READY", target: "production", createdAt: Date.now() - day, commitMessage: "latest" },
      { state: "READY", target: null, createdAt: Date.now() - day, commitMessage: "preview" },
      { state: "ERROR", target: "production", createdAt: Date.now() - 9 * day, commitMessage: "old" },
    ]);
    const { shipping } = await loadOverview(30, "humans");
    expect(shipping).toEqual({
      available: true,
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
    expect(shipping).toEqual({ available: false, commits7d: 0, commits14d: 0, deploys7d: 0, lastDeploy: null });
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

  it("maps daily engagement rows with a numeric zero fill", async () => {
    tag.mockImplementation((strings: TemplateStringsArray) =>
      Promise.resolve(
        strings.join("?").includes("reader_minutes")
          ? [
              { date: "2026-11-01", readers: "4", read_through_pct: "12.5", reader_minutes: "7" },
              { date: "2026-11-02", readers: null, read_through_pct: null, reader_minutes: null },
            ]
          : [],
      ),
    );
    const { dailyEngagement } = await loadOverview(30, "humans");
    expect(dailyEngagement).toEqual([
      { date: "2026-11-01", readers: 4, read_through_pct: 12.5, reader_minutes: 7 },
      { date: "2026-11-02", readers: 0, read_through_pct: 0, reader_minutes: 0 },
    ]);
  });

  it("scopes the daily engagement query like the KPI windows", async () => {
    await loadOverview(30, "humans");
    const q = text().find((t) => t.includes("reader_minutes")) ?? "";
    expect(q).toContain("COUNT(DISTINCT u.ip_address)");
    expect(q).toContain("FROM scroll_events");
    expect(q).toContain("UNION ALL");
    expect(q).toContain("FROM page_engagement");
    expect(q).toContain("EXISTS");
    expect(q).toContain("ROUND(mins.seconds / 60.0)");
  });

  it("excludes automated metric commits from the shipping counts", async () => {
    fetchRecentCommits.mockResolvedValue([
      { sha: "a", message: "chore: update gmail metrics 2026-11-07", date: new Date().toISOString() },
      { sha: "b", message: "fix: real work", date: new Date().toISOString() },
    ]);
    const { shipping } = await loadOverview(30, "humans");
    expect(shipping.commits7d).toBe(1);
    expect(shipping.commits14d).toBe(1);
  });

  it("falls back to zeros when every query fails", async () => {
    tag.mockImplementation(() => Promise.reject(new Error("boom")));
    const data = await loadOverview(30, "humans");
    expect(data.kpis.views).toEqual({ current: 0, previous: 0 });
    expect(data.kpis.pending).toBe(0);
    expect(data.trend).toEqual([]);
    expect(data.dailyEngagement).toEqual([]);
  });
});
