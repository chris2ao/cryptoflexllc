import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../cleanup-page-views/route";
import { ensureAnalyticsSchema } from "@/lib/analytics-schema";

const mockSql = vi.fn();
const classify = vi.fn();
const enrich = vi.fn();
const pruneOps = vi.fn();
const pruneIntel = vi.fn();

vi.mock("@/lib/analytics", () => ({ getDb: vi.fn(() => mockSql) }));
vi.mock("@/lib/analytics-schema", () => ({
  ensureAnalyticsSchema: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/analytics-retention", () => ({
  pruneOperationalRecords: (...args: unknown[]) => pruneOps(...args),
  pruneStaleIntel: (...args: unknown[]) => pruneIntel(...args),
}));
vi.mock("@/lib/traffic/backfill", () => ({
  backfillLegacyReferrers: vi.fn().mockResolvedValue(3),
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
    pruneOps.mockResolvedValue({ serverEvents: 11, cronRuns: 12, digestRuns: 13 });
    pruneIntel.mockResolvedValue(14);
    vi.mocked(ensureAnalyticsSchema).mockResolvedValue(true);
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
      legacyReferrers: 3,
      classified: 5120,
      enriched: 37,
      pruned: { serverEvents: 11, cronRuns: 12, digestRuns: 13, intel: 14 },
    });
    expect(classify).toHaveBeenCalledTimes(3);
    expect(enrich).toHaveBeenCalledWith(mockSql, 60, expect.objectContaining({ deadline: expect.any(Number) }));
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

  it("records a cron_runs row with the counts", async () => {
    classify.mockResolvedValueOnce(0);
    enrich.mockResolvedValue(2);
    await GET(req(true));
    const insert = mockSql.mock.calls.find((c) =>
      (c[0] as TemplateStringsArray).join("?").includes("INSERT INTO cron_runs"),
    );
    expect(insert).toBeDefined();
    expect(insert?.[1]).toBe("cleanup-page-views");
    expect(insert?.[2]).toBe(true);
    expect(insert?.[4]).toBe("anonymized 4, legacy referrers 3, classified 0, enriched 2, pruned events 11, runs 12, digests 13, intel 14");
  });

  it("still runs every stage and returns 200 when the schema is not ready", async () => {
    vi.mocked(ensureAnalyticsSchema).mockResolvedValue(false);
    classify.mockResolvedValueOnce(0);
    enrich.mockResolvedValue(1);
    const res = await GET(req(true));
    expect(res.status).toBe(200);
    expect((await res.json()).enriched).toBe(1);
    expect(classify).toHaveBeenCalled();
    expect(enrich).toHaveBeenCalled();
    expect(pruneOps).toHaveBeenCalled();
  });

  it("reports zero prune counts and keeps going when the prune stage throws", async () => {
    pruneOps.mockRejectedValue(new Error("boom"));
    classify.mockResolvedValueOnce(0);
    enrich.mockResolvedValue(0);
    const res = await GET(req(true));
    expect(res.status).toBe(200);
    expect((await res.json()).pruned).toEqual({
      serverEvents: 0,
      cronRuns: 0,
      digestRuns: 0,
      intel: 0,
    });
    expect(enrich).toHaveBeenCalled();
  });
});
