import { describe, it, expect } from "vitest";
import {
  gmailRunSchema,
  sessionEntrySchema,
  gmailMetricsBodySchema,
  MAX_GMAIL_RUNS,
  MAX_SESSION_ENTRIES,
} from "./gmail-metrics-schemas";

function validRun() {
  return {
    run_id: "13292a94-99d3-439c-b8a9-2a49991c55fe",
    started_at: "2026-09-22T12:08:02.498068+00:00",
    ended_at: "2026-09-22T12:11:02.111476+00:00",
    status: "success",
    duration_seconds: 180,
    messages_scanned: 11,
    messages_trashed: 5,
    messages_archived: 4,
    messages_flagged: 0,
    filters_created: 0,
    unsubscribes_succeeded: 0,
    cost_usd: 0.0,
    circuit_breaker_tripped: false,
    agent_version: "0.1.0",
    attention_email_sent: false,
    error: null,
  };
}

function validSession() {
  return {
    id: "2026-09-",
    date: "2026-09-22",
    time: "08:10",
    sizeBytes: 91792,
    sizeMB: "0.09",
  };
}

describe("gmailRunSchema", () => {
  it("accepts a full valid run", () => {
    expect(gmailRunSchema.safeParse(validRun()).success).toBe(true);
  });

  it("accepts a run with only the required fields (optionals omitted)", () => {
    const { filters_created, unsubscribes_succeeded, cost_usd, circuit_breaker_tripped, agent_version, attention_email_sent, error, ...required } =
      validRun();
    void filters_created;
    void unsubscribes_succeeded;
    void cost_usd;
    void circuit_breaker_tripped;
    void agent_version;
    void attention_email_sent;
    void error;
    expect(gmailRunSchema.safeParse(required).success).toBe(true);
  });

  it("accepts a null ended_at (a still-running or crashed run)", () => {
    const result = gmailRunSchema.safeParse({ ...validRun(), ended_at: null });
    expect(result.success).toBe(true);
  });

  it("accepts a null error", () => {
    const result = gmailRunSchema.safeParse({ ...validRun(), error: null });
    expect(result.success).toBe(true);
  });

  it("accepts a string error", () => {
    const result = gmailRunSchema.safeParse({ ...validRun(), error: "TimeoutError" });
    expect(result.success).toBe(true);
  });

  it("rejects a bad status", () => {
    const result = gmailRunSchema.safeParse({ ...validRun(), status: "in-limbo" });
    expect(result.success).toBe(false);
  });

  it("rejects a negative duration_seconds", () => {
    const result = gmailRunSchema.safeParse({ ...validRun(), duration_seconds: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects a non-integer messages_scanned", () => {
    const result = gmailRunSchema.safeParse({ ...validRun(), messages_scanned: 1.5 });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid started_at", () => {
    const result = gmailRunSchema.safeParse({ ...validRun(), started_at: "not-a-date" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing run_id", () => {
    const { run_id: _run_id, ...rest } = validRun();
    void _run_id;
    const result = gmailRunSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects an error string over 300 chars", () => {
    const result = gmailRunSchema.safeParse({ ...validRun(), error: "x".repeat(301) });
    expect(result.success).toBe(false);
  });
});

describe("sessionEntrySchema", () => {
  it("accepts a valid session entry", () => {
    expect(sessionEntrySchema.safeParse(validSession()).success).toBe(true);
  });

  it("rejects a malformed date", () => {
    const result = sessionEntrySchema.safeParse({ ...validSession(), date: "09/22/2026" });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed time", () => {
    const result = sessionEntrySchema.safeParse({ ...validSession(), time: "8:10am" });
    expect(result.success).toBe(false);
  });

  it("rejects a negative sizeBytes", () => {
    const result = sessionEntrySchema.safeParse({ ...validSession(), sizeBytes: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects an empty id", () => {
    const result = sessionEntrySchema.safeParse({ ...validSession(), id: "" });
    expect(result.success).toBe(false);
  });
});

describe("gmailMetricsBodySchema", () => {
  it("accepts an empty-but-present pair of arrays", () => {
    const result = gmailMetricsBodySchema.safeParse({ gmailMetrics: [], sessionArchive: [] });
    expect(result.success).toBe(true);
  });

  it("accepts a normal payload", () => {
    const result = gmailMetricsBodySchema.safeParse({
      gmailMetrics: [validRun()],
      sessionArchive: [validSession()],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing gmailMetrics key", () => {
    const result = gmailMetricsBodySchema.safeParse({ sessionArchive: [] });
    expect(result.success).toBe(false);
  });

  it(`rejects more than ${MAX_GMAIL_RUNS} gmail runs`, () => {
    const gmailMetrics = Array.from({ length: MAX_GMAIL_RUNS + 1 }, () => validRun());
    const result = gmailMetricsBodySchema.safeParse({ gmailMetrics, sessionArchive: [] });
    expect(result.success).toBe(false);
  });

  it(`accepts exactly ${MAX_GMAIL_RUNS} gmail runs`, () => {
    const gmailMetrics = Array.from({ length: MAX_GMAIL_RUNS }, () => validRun());
    const result = gmailMetricsBodySchema.safeParse({ gmailMetrics, sessionArchive: [] });
    expect(result.success).toBe(true);
  });

  it(`rejects more than ${MAX_SESSION_ENTRIES} session entries`, () => {
    const sessionArchive = Array.from({ length: MAX_SESSION_ENTRIES + 1 }, () => validSession());
    const result = gmailMetricsBodySchema.safeParse({ gmailMetrics: [], sessionArchive });
    expect(result.success).toBe(false);
  });
});
