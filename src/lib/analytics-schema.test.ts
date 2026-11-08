import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  SCHEMA_STATEMENTS,
  ensureAnalyticsSchema,
  resetSchemaMemoForTests,
} from "./analytics-schema";

describe("analytics schema", () => {
  beforeEach(() => {
    resetSchemaMemoForTests();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("runs every statement once per process", async () => {
    const sql = vi.fn().mockResolvedValue([]);
    await ensureAnalyticsSchema(sql as never);
    await ensureAnalyticsSchema(sql as never);
    expect(sql).toHaveBeenCalledTimes(SCHEMA_STATEMENTS.length);
  });

  it("uses sql.query when the tag exposes it", async () => {
    const sql = Object.assign(vi.fn(), {
      query: vi.fn().mockResolvedValue([]),
    });
    await ensureAnalyticsSchema(sql as never);
    expect(sql.query).toHaveBeenCalledTimes(SCHEMA_STATEMENTS.length);
    expect(sql).not.toHaveBeenCalled();
  });

  it("declares the new columns and tables", () => {
    const all = SCHEMA_STATEMENTS.join("\n");
    expect(all).toContain("ADD COLUMN IF NOT EXISTS traffic_class");
    expect(all).toContain("CREATE TABLE IF NOT EXISTS digest_runs");
  });

  it("does not throw on a failed statement and retries on the next call", async () => {
    const sql = vi
      .fn()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue([]);
    await expect(ensureAnalyticsSchema(sql as never)).resolves.toBeUndefined();
    const callsAfterFailure = sql.mock.calls.length;
    await ensureAnalyticsSchema(sql as never);
    expect(sql.mock.calls.length).toBeGreaterThan(callsAfterFailure);
    expect(sql.mock.calls.length - callsAfterFailure).toBe(
      SCHEMA_STATEMENTS.length,
    );
  });
});
