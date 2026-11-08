import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../cleanup-page-views/route";

const mockSql = vi.fn();
const classify = vi.fn();
const enrich = vi.fn();

vi.mock("@/lib/analytics", () => ({ getDb: vi.fn(() => mockSql) }));
vi.mock("@/lib/analytics-schema", () => ({
  ensureAnalyticsSchema: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/traffic/backfill", () => ({
  classifyPendingPageViews: (...args: unknown[]) => classify(...args),
}));
vi.mock("@/lib/ip-enrichment/batch", () => ({
  enrichPendingIps: (...args: unknown[]) => enrich(...args),
}));

function req(withAuth: boolean) {
  return new NextRequest("http://localhost/api/cron/cleanup-page-views", {
    headers: withAuth ? { authorization: "Bearer test-secret" } : {},
  });
}

describe("cleanup-page-views cron", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = "test-secret";
    mockSql.mockResolvedValue({ count: 4 });
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("rejects requests without the bearer", async () => {
    const res = await GET(req(false));
    expect(res.status).toBe(401);
    expect(classify).not.toHaveBeenCalled();
  });

  it("loops classify until 0, then enriches, and reports counts", async () => {
    classify.mockResolvedValueOnce(5000).mockResolvedValueOnce(120).mockResolvedValueOnce(0);
    enrich.mockResolvedValue(37);
    const res = await GET(req(true));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      anonymized: 4,
      retentionDays: 90,
      classified: 5120,
      enriched: 37,
    });
    expect(classify).toHaveBeenCalledTimes(3);
    expect(enrich).toHaveBeenCalledWith(mockSql, 60);
  });

  it("still enriches when classification throws", async () => {
    classify.mockRejectedValue(new Error("boom"));
    enrich.mockResolvedValue(37);
    const res = await GET(req(true));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.classified).toBe(0);
    expect(body.enriched).toBe(37);
  });
});
