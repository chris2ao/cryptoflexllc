import { describe, it, expect, vi } from "vitest";
import { classifyPendingPageViews } from "./backfill";
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
