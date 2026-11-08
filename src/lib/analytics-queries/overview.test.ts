import { describe, it, expect, vi, beforeEach } from "vitest";

const tag = vi.fn();
vi.mock("@/lib/analytics", () => ({ getDb: () => tag }));
vi.mock("@/lib/blog", () => ({
  getAllPosts: () => [
    { slug: "a", title: "A", date: new Date().toISOString().slice(0, 10) },
    { slug: "old", title: "Old", date: "2001-01-01" },
  ],
}));

import { loadOverview } from "./overview";

const text = () => tag.mock.calls.map((c) => (c[0] as string[]).join("?"));

describe("loadOverview", () => {
  beforeEach(() => {
    tag.mockReset();
    tag.mockResolvedValue([]);
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
