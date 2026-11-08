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
      ]);
    await ensureAnalyticsSchema(sql as never);
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

  it("does not throw on a failure, waits before retrying, then retries", async () => {
    const sql = vi
      .fn()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue([]);
    const t0 = 1_000_000;
    await expect(
      ensureAnalyticsSchema(sql as never, t0),
    ).resolves.toBeUndefined();
    const callsAfterFailure = sql.mock.calls.length;
    await ensureAnalyticsSchema(sql as never, t0 + 1000);
    expect(sql.mock.calls.length).toBe(callsAfterFailure);
    await ensureAnalyticsSchema(sql as never, t0 + SCHEMA_RETRY_AFTER_MS + 1);
    expect(sql.mock.calls.length - callsAfterFailure).toBe(
      SCHEMA_STATEMENTS.length + 1,
    );
  });
});
