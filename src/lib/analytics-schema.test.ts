import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  SCHEMA_RETRY_AFTER_MS,
  SCHEMA_STATEMENTS,
  ensureAnalyticsSchema,
  resetSchemaMemoForTests,
} from "./analytics-schema";

describe("analytics schema", () => {
  beforeEach(() => {
    resetSchemaMemoForTests();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("runs the presence check and every statement once per process", async () => {
    const sql = vi.fn().mockResolvedValue([]);
    await ensureAnalyticsSchema(sql as never);
    await ensureAnalyticsSchema(sql as never);
    expect(sql).toHaveBeenCalledTimes(SCHEMA_STATEMENTS.length + 1);
    expect(String(sql.mock.calls[0][0])).toContain("information_schema.columns");
    expect(String(sql.mock.calls[0][0])).toContain("pg_indexes");
  });

  it("skips the statements when the marker columns already exist", async () => {
    const sql = vi
      .fn()
      .mockResolvedValue([
        { marker: "traffic_class" },
        { marker: "enriched_at" },
        { marker: "idx_page_views_legacy_referrer" },
        { marker: "idx_page_engagement_ip_recorded" },
      ]);
    await expect(ensureAnalyticsSchema(sql as never)).resolves.toBe(true);
    await ensureAnalyticsSchema(sql as never);
    expect(sql).toHaveBeenCalledTimes(1);
  });

  it("uses sql.query when the tag exposes it", async () => {
    const sql = Object.assign(vi.fn(), {
      query: vi.fn().mockResolvedValue([]),
    });
    await ensureAnalyticsSchema(sql as never);
    expect(sql.query).toHaveBeenCalledTimes(SCHEMA_STATEMENTS.length + 1);
    expect(sql).not.toHaveBeenCalled();
  });

  it("declares the new columns and tables", () => {
    const all = SCHEMA_STATEMENTS.join("\n");
    expect(all).toContain("ADD COLUMN IF NOT EXISTS traffic_class");
    expect(all).toContain("CREATE TABLE IF NOT EXISTS digest_runs");
  });

  it("creates scroll and engagement tables and the new indexes before server_events", () => {
    const idx = (needle: string) =>
      SCHEMA_STATEMENTS.findIndex((s) => s.includes(needle));
    const order = [
      "CREATE TABLE IF NOT EXISTS scroll_events",
      "CREATE TABLE IF NOT EXISTS page_engagement",
      "idx_page_views_class_visited ON page_views (traffic_class, visited_at)",
      "idx_scroll_events_ip_recorded ON scroll_events (ip_address, recorded_at)",
      "idx_page_engagement_ip_recorded ON page_engagement (ip_address, recorded_at)",
      "CREATE TABLE IF NOT EXISTS server_events",
    ].map(idx);
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("checks four presence markers including the engagement index", async () => {
    const sql = vi.fn().mockResolvedValue([
      { marker: "a" },
      { marker: "b" },
      { marker: "c" },
    ]);
    await ensureAnalyticsSchema(sql as never);
    expect(String(sql.mock.calls[0][0])).toContain("idx_page_engagement_ip_recorded");
    // Three markers are not enough: the chain runs.
    expect(sql).toHaveBeenCalledTimes(SCHEMA_STATEMENTS.length + 1);
  });

  it("returns true after a clean chain, false on failure and during backoff", async () => {
    const ok = vi.fn().mockResolvedValue([]);
    await expect(ensureAnalyticsSchema(ok as never)).resolves.toBe(true);
    resetSchemaMemoForTests();
    const bad = vi.fn().mockRejectedValue(new Error("boom"));
    const t0 = 5_000_000;
    await expect(ensureAnalyticsSchema(bad as never, t0)).resolves.toBe(false);
    await expect(ensureAnalyticsSchema(bad as never, t0 + 10)).resolves.toBe(false);
  });

  it("gives concurrent callers the same boolean", async () => {
    const sql = vi.fn().mockResolvedValue([]);
    const [a, b] = await Promise.all([
      ensureAnalyticsSchema(sql as never),
      ensureAnalyticsSchema(sql as never),
    ]);
    expect([a, b]).toEqual([true, true]);
  });

  it("does not throw on a failure, waits before retrying, then retries", async () => {
    const sql = vi
      .fn()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue([]);
    const t0 = 1_000_000;
    await expect(
      ensureAnalyticsSchema(sql as never, t0),
    ).resolves.toBe(false);
    const callsAfterFailure = sql.mock.calls.length;
    await ensureAnalyticsSchema(sql as never, t0 + 1000);
    expect(sql.mock.calls.length).toBe(callsAfterFailure);
    await ensureAnalyticsSchema(sql as never, t0 + SCHEMA_RETRY_AFTER_MS + 1);
    expect(sql.mock.calls.length - callsAfterFailure).toBe(
      SCHEMA_STATEMENTS.length + 1,
    );
  });
});
