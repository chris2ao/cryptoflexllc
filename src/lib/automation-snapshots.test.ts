import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getSnapshot,
  putSnapshot,
  loadGmailMetricsSnapshots,
} from "./automation-snapshots";

function missingTableError() {
  const error = new Error('relation "automation_snapshots" does not exist') as Error & {
    code: string;
  };
  error.code = "42P01";
  return error;
}

describe("getSnapshot", () => {
  it("returns the row when one exists", async () => {
    const now = new Date("2026-09-22T12:00:00Z");
    const sql = vi.fn().mockResolvedValue([
      { name: "gmail-metrics", payload: [{ run_id: "abc" }], updated_at: now },
    ]);

    const row = await getSnapshot(sql as never, "gmail-metrics");

    expect(row).toEqual({
      name: "gmail-metrics",
      payload: [{ run_id: "abc" }],
      updated_at: now.toISOString(),
    });
  });

  it("returns null when no row exists for the name", async () => {
    const sql = vi.fn().mockResolvedValue([]);

    const row = await getSnapshot(sql as never, "gmail-metrics");

    expect(row).toBeNull();
  });

  it("returns null when the table has not been created yet (42P01)", async () => {
    const sql = vi.fn().mockRejectedValue(missingTableError());

    const row = await getSnapshot(sql as never, "gmail-metrics");

    expect(row).toBeNull();
  });

  it("propagates any other database error", async () => {
    const sql = vi.fn().mockRejectedValue(new Error("connection reset"));

    await expect(getSnapshot(sql as never, "gmail-metrics")).rejects.toThrow(
      "connection reset"
    );
  });
});

describe("putSnapshot", () => {
  it("creates the table if needed before the first write", async () => {
    const sql = vi.fn().mockResolvedValue([]);

    await putSnapshot(sql as never, "gmail-metrics", []);

    const firstSql = sql.mock.calls[0][0].join(" ");
    expect(firstSql).toContain("CREATE TABLE IF NOT EXISTS automation_snapshots");
    expect(firstSql).toContain("name TEXT PRIMARY KEY");
  });

  it("upserts the row with a JSON-serialized payload", async () => {
    const sql = vi.fn().mockResolvedValue([]);

    await putSnapshot(sql as never, "gmail-metrics", [{ run_id: "abc" }]);

    expect(sql).toHaveBeenCalledTimes(2);
    const call = sql.mock.calls[1];
    const [strings, name, payloadJson] = call;
    const sqlText = strings.join(" ");
    expect(sqlText).toContain("INSERT INTO automation_snapshots");
    expect(sqlText).toContain("ON CONFLICT (name)");
    expect(name).toBe("gmail-metrics");
    expect(JSON.parse(payloadJson)).toEqual([{ run_id: "abc" }]);
  });
});

describe("loadGmailMetricsSnapshots", () => {
  let sql: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sql = vi.fn();
  });

  it("returns empty arrays when neither row exists (fresh table)", async () => {
    sql.mockResolvedValue([]);

    const result = await loadGmailMetricsSnapshots(sql as never);

    expect(result).toEqual({ gmailRuns: [], sessions: [] });
  });

  it("returns empty arrays when the table does not exist yet", async () => {
    sql.mockRejectedValue(missingTableError());

    const result = await loadGmailMetricsSnapshots(sql as never);

    expect(result).toEqual({ gmailRuns: [], sessions: [] });
  });

  it("returns parsed rows when both snapshots exist and validate", async () => {
    const validRun = {
      run_id: "abc",
      started_at: "2026-09-22T12:00:00.000000+00:00",
      ended_at: "2026-09-22T12:01:00.000000+00:00",
      status: "success",
      duration_seconds: 60,
      messages_scanned: 5,
      messages_trashed: 2,
      messages_archived: 1,
      messages_flagged: 0,
    };
    const validSession = {
      id: "session-1",
      date: "2026-09-22",
      time: "08:10",
      sizeBytes: 1024,
      sizeMB: "0.00",
    };

    // Both getSnapshot calls share the same query shape; branch on the
    // `name` bind param, the first positional arg after the strings array.
    sql.mockImplementation(async (_strings: TemplateStringsArray, name: string) => {
      if (name === "gmail-metrics") {
        return [{ name, payload: [validRun], updated_at: new Date("2026-09-22T12:05:00Z") }];
      }
      if (name === "session-archive") {
        return [
          { name, payload: [validSession], updated_at: new Date("2026-09-22T12:05:00Z") },
        ];
      }
      return [];
    });

    const result = await loadGmailMetricsSnapshots(sql as never);

    expect(result.gmailRuns).toEqual([validRun]);
    expect(result.sessions).toEqual([validSession]);
  });

  it("falls back to an empty array for a snapshot whose payload fails schema validation", async () => {
    sql.mockImplementation(async (_strings: TemplateStringsArray, name: string) => {
      if (name === "gmail-metrics") {
        return [
          {
            name,
            payload: [{ not: "a valid run" }],
            updated_at: new Date("2026-09-22T12:05:00Z"),
          },
        ];
      }
      return [];
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await loadGmailMetricsSnapshots(sql as never);

    expect(result.gmailRuns).toEqual([]);
    expect(result.sessions).toEqual([]);
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it("falls back to an empty array for a snapshot lookup that throws a non-missing-table error", async () => {
    sql.mockRejectedValue(new Error("connection reset"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await loadGmailMetricsSnapshots(sql as never);

    expect(result).toEqual({ gmailRuns: [], sessions: [] });
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
