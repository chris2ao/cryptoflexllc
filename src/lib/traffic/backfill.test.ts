import { describe, it, expect, vi } from "vitest";
import { backfillLegacyReferrers, classifyPendingPageViews } from "./backfill";
import { BOT_UA_PATTERN_SOURCE } from "./classify";

function mockSql(rows: unknown[]) {
  const fn = vi.fn().mockResolvedValue(rows);
  return fn as unknown as Parameters<typeof classifyPendingPageViews>[0] & typeof fn;
}

describe("classifyPendingPageViews", () => {
  it("returns the updated count and binds limit and bot pattern", async () => {
    const sql = mockSql([{ updated: 42 }]);
    expect(await classifyPendingPageViews(sql, 100)).toBe(42);
    const [strings, ...values] = sql.mock.calls[0] as [string[], ...unknown[]];
    const text = strings.join("?");
    for (const needle of ["traffic_class IS NULL", "LIMIT", "auth_attempts", "ip_intel", "RETURNING"]) {
      expect(text).toContain(needle);
    }
    expect(values).toContain(100);
    expect(values).toContain(BOT_UA_PATTERN_SOURCE);
    expect(sql).toHaveBeenCalledTimes(1);
  });

  it("returns 0 for no rows", async () => {
    expect(await classifyPendingPageViews(mockSql([]))).toBe(0);
  });

  it("returns 0 when nothing was updated", async () => {
    expect(await classifyPendingPageViews(mockSql([{ updated: 0 }]))).toBe(0);
  });
});

describe("backfillLegacyReferrers", () => {
  it("classifies each distinct legacy referrer group and re-marks forged hits", async () => {
    const sql = vi.fn();
    sql.mockResolvedValueOnce([
      { referrer: "https://www.aocr.org/", utm_source: null, utm_medium: null, n: 1668 },
      { referrer: "https://www.google.com/", utm_source: null, utm_medium: null, n: 12 },
      { referrer: "not a url", utm_source: null, utm_medium: null, n: 1 },
    ]);
    sql.mockResolvedValue([]);
    const n = await backfillLegacyReferrers(sql as never, 100);
    expect(n).toBe(3);
    const updates = sql.mock.calls.slice(1, 4).map((c) => c.slice(1));
    expect(updates[0].slice(0, 2)).toEqual(["aocr.org", "forged"]);
    expect(updates[1].slice(0, 2)).toEqual(["google.com", "search"]);
    expect(updates[2].slice(0, 2)).toEqual(["none", "direct"]);
    const last = String(sql.mock.calls[4][0].join("?"));
    expect(last).toContain("traffic_class = 'bot'");
    expect(last).toContain("referrer_class = 'forged'");
  });

  it("does nothing when no legacy rows remain", async () => {
    const sql = vi.fn().mockResolvedValue([]);
    expect(await backfillLegacyReferrers(sql as never, 100)).toBe(0);
    expect(sql).toHaveBeenCalledTimes(1);
  });
});
