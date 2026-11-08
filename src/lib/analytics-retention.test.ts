import { describe, it, expect, vi, beforeEach } from "vitest";
import { pruneOperationalRecords, pruneStaleIntel } from "./analytics-retention";

function text(call: unknown[]): string {
  return (call[0] as TemplateStringsArray).join("?");
}

describe("pruneOperationalRecords", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("deletes by the right timestamp column with bound day counts", async () => {
    const sql = vi.fn().mockResolvedValue({ count: 2 });
    const counts = await pruneOperationalRecords(sql as never);
    expect(counts).toEqual({ serverEvents: 2, cronRuns: 2, digestRuns: 2 });
    const [a, b, c] = sql.mock.calls;
    expect(text(a)).toContain("DELETE FROM server_events");
    expect(text(a)).toContain("occurred_at < NOW() - make_interval(days => ?)");
    expect(a[1]).toBe(90);
    expect(text(b)).toContain("DELETE FROM cron_runs");
    expect(text(b)).toContain("ran_at <");
    expect(b[1]).toBe(90);
    expect(text(c)).toContain("DELETE FROM digest_runs");
    expect(c[1]).toBe(365);
  });

  it("honours custom windows", async () => {
    const sql = vi.fn().mockResolvedValue({ count: 0 });
    await pruneOperationalRecords(sql as never, {
      serverEventsDays: 1,
      cronRunsDays: 2,
      digestRunsDays: 3,
    });
    expect(sql.mock.calls.map((c) => c[1])).toEqual([1, 2, 3]);
  });

  it("logs a failed delete, counts 0, and still runs the others", async () => {
    const sql = vi
      .fn()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue({ count: 5 });
    const counts = await pruneOperationalRecords(sql as never);
    expect(counts).toEqual({ serverEvents: 0, cronRuns: 5, digestRuns: 5 });
    expect(console.error).toHaveBeenCalled();
  });
});

describe("pruneStaleIntel", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("only deletes stale rows with no page_views reference", async () => {
    const sql = vi.fn().mockResolvedValue({ count: 7 });
    expect(await pruneStaleIntel(sql as never)).toBe(7);
    const q = text(sql.mock.calls[0]);
    expect(q).toContain("DELETE FROM ip_intel i");
    expect(q).toContain("i.cached_at < NOW() - make_interval(days => ?)");
    expect(q).toContain(
      "NOT EXISTS (SELECT 1 FROM page_views pv WHERE pv.ip_address = i.ip_address)",
    );
    expect(sql.mock.calls[0][1]).toBe(90);
  });

  it("returns 0 on failure", async () => {
    const sql = vi.fn().mockRejectedValue(new Error("boom"));
    expect(await pruneStaleIntel(sql as never, 30)).toBe(0);
    expect(console.error).toHaveBeenCalled();
  });
});
