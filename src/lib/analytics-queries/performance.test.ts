import { describe, it, expect, vi, beforeEach } from "vitest";

const tag = vi.fn();
vi.mock("@/lib/analytics", () => ({ getDb: () => tag }));

const fetchWebAnalyticsCount = vi.fn();
const fetchWebAnalyticsDaily = vi.fn();
const fetchDeployments = vi.fn();
const isVercelApiConfigured = vi.fn();
vi.mock("@/lib/vercel-api", () => ({
  fetchWebAnalyticsCount: (...a: unknown[]) => fetchWebAnalyticsCount(...a),
  fetchWebAnalyticsDaily: (...a: unknown[]) => fetchWebAnalyticsDaily(...a),
  fetchDeployments: (...a: unknown[]) => fetchDeployments(...a),
  isVercelApiConfigured: () => isVercelApiConfigured(),
}));

import { loadPerformance } from "./performance";

describe("loadPerformance web analytics", () => {
  beforeEach(() => {
    tag.mockReset().mockResolvedValue([]);
    fetchWebAnalyticsCount.mockReset();
    fetchWebAnalyticsDaily.mockReset();
    fetchDeployments.mockReset();
    isVercelApiConfigured.mockReset().mockReturnValue(true);
  });

  it("combines our scoped counts with Vercel's over at most 30 days", async () => {
    tag.mockResolvedValue([{ pageviews: 50, visitors: 20 }]);
    fetchWebAnalyticsCount.mockResolvedValue({ state: "ok", pageviews: 75, visitors: 30 });
    fetchWebAnalyticsDaily.mockResolvedValue({
      state: "ok",
      rows: [{ date: "2026-11-01", pageviews: 5, visitors: 3 }],
    });
    fetchDeployments.mockResolvedValue([{ id: "d1" }]);
    const data = await loadPerformance(90, "humans");
    expect(data.webAnalytics.state).toBe("ok");
    expect(data.webAnalytics.ours).toEqual({ pageviews: 50, visitors: 20 });
    expect(data.webAnalytics.theirs).toEqual({ pageviews: 75, visitors: 30 });
    expect(data.webAnalytics.daily).toHaveLength(1);
    expect(data.deployments).toHaveLength(1);
    const [since, until] = fetchWebAnalyticsCount.mock.calls[0] as string[];
    const span = (Date.parse(until) - Date.parse(since)) / 86_400_000;
    expect(span).toBe(30);
    expect(fetchDeployments).toHaveBeenCalledWith(10);
    expect(tag.mock.calls.some((c) => c.slice(1).includes("human"))).toBe(true);
  });

  it("passes not-enabled through with no theirs", async () => {
    fetchWebAnalyticsCount.mockResolvedValue({ state: "not-enabled", pageviews: 0, visitors: 0 });
    fetchWebAnalyticsDaily.mockResolvedValue({ state: "not-enabled", rows: [] });
    fetchDeployments.mockResolvedValue([]);
    const data = await loadPerformance(7);
    expect(data.webAnalytics.state).toBe("not-enabled");
    expect(data.webAnalytics.theirs).toBeNull();
  });

  it("skips the external calls when the API is not configured", async () => {
    isVercelApiConfigured.mockReturnValue(false);
    const data = await loadPerformance(7);
    expect(data.webAnalytics.state).toBe("unavailable");
    expect(data.deployments).toEqual([]);
    expect(fetchWebAnalyticsCount).not.toHaveBeenCalled();
    expect(fetchDeployments).not.toHaveBeenCalled();
  });

  it("survives rejected fetchers", async () => {
    fetchWebAnalyticsCount.mockRejectedValue(new Error("x"));
    fetchWebAnalyticsDaily.mockRejectedValue(new Error("x"));
    fetchDeployments.mockRejectedValue(new Error("x"));
    const data = await loadPerformance(7);
    expect(data.webAnalytics.state).toBe("unavailable");
    expect(data.deployments).toEqual([]);
  });
});
