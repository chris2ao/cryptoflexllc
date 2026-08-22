import { describe, it, expect, vi } from "vitest";
import fs from "fs";
import path from "path";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import {
  shapePanelRows,
  summarize,
  latestDecisions,
  loadUnsubscribePanel,
  type UnsubscribeCandidateDbRow,
  type UnsubscribeDecisionDbRow,
  type UnsubscribeAttemptDbRow,
} from "./gmail-unsubscribe";
import type { UnsubscribePanelRow, UnsubscribeAttemptSummary } from "./analytics-types";

function candidate(
  overrides: Partial<UnsubscribeCandidateDbRow> = {}
): UnsubscribeCandidateDbRow {
  return {
    sender_email: "deals@example.com",
    sender_domain: "example.com",
    method: "rfc8058-post",
    trashed_count_14d: 3,
    first_seen: "2026-08-01T00:00:00.000Z",
    last_seen: "2026-08-15T00:00:00.000Z",
    last_pushed_at: "2026-08-15T00:00:00.000Z",
    ...overrides,
  };
}

function decision(
  overrides: Partial<UnsubscribeDecisionDbRow> = {}
): UnsubscribeDecisionDbRow {
  return {
    id: 1,
    sender_email: "deals@example.com",
    decision: "approve",
    decided_at: "2026-08-10T00:00:00.000Z",
    note: null,
    ...overrides,
  };
}

function attempt(
  overrides: Partial<UnsubscribeAttemptDbRow> = {}
): UnsubscribeAttemptDbRow {
  return {
    id: 1,
    sender_email: "deals@example.com",
    attempted_at: "2026-08-11T00:00:00.000Z",
    status_code: 200,
    succeeded: true,
    silent_14d: null,
    silence_measured_at: null,
    ...overrides,
  };
}

describe("shapePanelRows", () => {
  it("picks the latest decision by decided_at", () => {
    const candidates = [candidate({ sender_email: "a@example.com" })];
    const decisions = [
      decision({
        id: 1,
        sender_email: "a@example.com",
        decision: "approve",
        decided_at: "2026-08-10T00:00:00.000Z",
      }),
      decision({
        id: 2,
        sender_email: "a@example.com",
        decision: "deny",
        decided_at: "2026-08-12T00:00:00.000Z",
      }),
    ];

    const rows = shapePanelRows(candidates, decisions, []);

    expect(rows[0].decision).toBe("deny");
    expect(rows[0].decided_at).toBe("2026-08-12T00:00:00.000Z");
  });

  it("breaks a decided_at tie with the higher id", () => {
    const candidates = [candidate({ sender_email: "a@example.com" })];
    const decisions = [
      decision({
        id: 1,
        sender_email: "a@example.com",
        decision: "approve",
        decided_at: "2026-08-10T00:00:00.000Z",
      }),
      decision({
        id: 2,
        sender_email: "a@example.com",
        decision: "deny",
        decided_at: "2026-08-10T00:00:00.000Z",
      }),
    ];

    const rows = shapePanelRows(candidates, decisions, []);

    expect(rows[0].decision).toBe("deny");
  });

  it("counts attempts at or after decided_at as attempts_since_decision", () => {
    const candidates = [candidate({ sender_email: "a@example.com" })];
    const decisions = [
      decision({ sender_email: "a@example.com", decided_at: "2026-08-10T00:00:00.000Z" }),
    ];
    const attempts = [
      attempt({ id: 1, sender_email: "a@example.com", attempted_at: "2026-08-09T00:00:00.000Z" }),
      attempt({ id: 2, sender_email: "a@example.com", attempted_at: "2026-08-10T00:00:00.000Z" }),
      attempt({ id: 3, sender_email: "a@example.com", attempted_at: "2026-08-11T00:00:00.000Z" }),
    ];

    const rows = shapePanelRows(candidates, decisions, attempts);

    expect(rows[0].attempts_since_decision).toBe(2);
  });

  it("attempts_since_decision is 0 when there is no decision", () => {
    const candidates = [candidate({ sender_email: "a@example.com" })];
    const attempts = [attempt({ sender_email: "a@example.com" })];

    const rows = shapePanelRows(candidates, [], attempts);

    expect(rows[0].attempts_since_decision).toBe(0);
  });

  it("last_attempt is the newest attempt", () => {
    const candidates = [candidate({ sender_email: "a@example.com" })];
    const attempts = [
      attempt({
        id: 1,
        sender_email: "a@example.com",
        attempted_at: "2026-08-09T00:00:00.000Z",
        status_code: 500,
        succeeded: false,
      }),
      attempt({
        id: 2,
        sender_email: "a@example.com",
        attempted_at: "2026-08-11T00:00:00.000Z",
        status_code: 200,
        succeeded: true,
      }),
    ];

    const rows = shapePanelRows(candidates, [], attempts);

    const expected: UnsubscribeAttemptSummary = {
      attempted_at: "2026-08-11T00:00:00.000Z",
      status_code: 200,
      succeeded: true,
      silent_14d: null,
      silence_measured_at: null,
    };
    expect(rows[0].last_attempt).toEqual(expected);
  });

  it("last_attempt is null when there are no attempts", () => {
    const candidates = [candidate({ sender_email: "a@example.com" })];

    const rows = shapePanelRows(candidates, [], []);

    expect(rows[0].last_attempt).toBeNull();
  });

  it("orders history newest first", () => {
    const candidates = [candidate({ sender_email: "a@example.com" })];
    const decisions = [
      decision({
        id: 1,
        sender_email: "a@example.com",
        decision: "approve",
        decided_at: "2026-08-05T00:00:00.000Z",
      }),
      decision({
        id: 2,
        sender_email: "a@example.com",
        decision: "deny",
        decided_at: "2026-08-10T00:00:00.000Z",
      }),
    ];

    const rows = shapePanelRows(candidates, decisions, []);

    expect(rows[0].history.map((entry) => entry.decision)).toEqual(["deny", "approve"]);
  });

  it("gives a candidate with no decisions a null decision and empty history", () => {
    const candidates = [candidate({ sender_email: "a@example.com" })];

    const rows = shapePanelRows(candidates, [], []);

    expect(rows[0].decision).toBeNull();
    expect(rows[0].decided_at).toBeNull();
    expect(rows[0].note).toBeNull();
    expect(rows[0].history).toEqual([]);
  });

  it("orders pending first by trashed_count_14d desc, then approved, then allowed", () => {
    const candidates = [
      candidate({ sender_email: "low-pending@example.com", trashed_count_14d: 2 }),
      candidate({ sender_email: "high-pending@example.com", trashed_count_14d: 9 }),
      candidate({ sender_email: "approved@example.com", trashed_count_14d: 5 }),
      candidate({ sender_email: "allowed@example.com", trashed_count_14d: 20 }),
    ];
    const decisions = [
      decision({ id: 1, sender_email: "approved@example.com", decision: "approve" }),
      decision({ id: 2, sender_email: "allowed@example.com", decision: "deny" }),
    ];

    const rows = shapePanelRows(candidates, decisions, []);

    expect(rows.map((row) => row.sender_email)).toEqual([
      "high-pending@example.com",
      "low-pending@example.com",
      "approved@example.com",
      "allowed@example.com",
    ]);
  });
});

describe("latestDecisions", () => {
  it("returns one decision per sender, newest by decided_at then id", () => {
    const decisions = [
      decision({
        id: 1,
        sender_email: "a@example.com",
        decision: "approve",
        decided_at: "2026-08-10T00:00:00.000Z",
      }),
      decision({
        id: 2,
        sender_email: "a@example.com",
        decision: "deny",
        decided_at: "2026-08-12T00:00:00.000Z",
      }),
      decision({
        id: 3,
        sender_email: "b@example.com",
        decision: "approve",
        decided_at: "2026-08-01T00:00:00.000Z",
      }),
    ];

    const latest = latestDecisions(decisions);

    expect(latest.size).toBe(2);
    expect(latest.get("a@example.com")?.decision).toBe("deny");
    expect(latest.get("b@example.com")?.decision).toBe("approve");
  });
});

describe("summarize", () => {
  function row(overrides: Partial<UnsubscribePanelRow> = {}): UnsubscribePanelRow {
    return {
      sender_email: "a@example.com",
      sender_domain: "example.com",
      method: "rfc8058-post",
      trashed_count_14d: 1,
      first_seen: "2026-08-01T00:00:00.000Z",
      last_seen: "2026-08-01T00:00:00.000Z",
      last_pushed_at: "2026-08-01T00:00:00.000Z",
      decision: null,
      decided_at: null,
      note: null,
      last_attempt: null,
      attempts_since_decision: 0,
      history: [],
      ...overrides,
    };
  }

  it("counts pending, approved, and allowed rows", () => {
    const rows = [
      row({ sender_email: "p@example.com", decision: null }),
      row({ sender_email: "a1@example.com", decision: "approve" }),
      row({ sender_email: "a2@example.com", decision: "approve" }),
      row({ sender_email: "d@example.com", decision: "deny" }),
    ];

    const summary = summarize(rows, new Date("2026-08-20T00:00:00.000Z"));

    expect(summary.pending).toBe(1);
    expect(summary.approved).toBe(2);
    expect(summary.allowed).toBe(1);
  });

  it("counts succeeded attempts in the trailing 7 days of now as unsubscribed_7d", () => {
    const now = new Date("2026-08-20T00:00:00.000Z");
    const rows = [
      row({
        sender_email: "recent@example.com",
        last_attempt: {
          attempted_at: "2026-08-15T00:00:00.000Z",
          status_code: 200,
          succeeded: true,
          silent_14d: null,
          silence_measured_at: null,
        },
      }),
      row({
        sender_email: "old@example.com",
        last_attempt: {
          attempted_at: "2026-08-01T00:00:00.000Z",
          status_code: 200,
          succeeded: true,
          silent_14d: null,
          silence_measured_at: null,
        },
      }),
      row({
        sender_email: "failed@example.com",
        last_attempt: {
          attempted_at: "2026-08-18T00:00:00.000Z",
          status_code: 500,
          succeeded: false,
          silent_14d: null,
          silence_measured_at: null,
        },
      }),
    ];

    const summary = summarize(rows, now);

    expect(summary.unsubscribed_7d).toBe(1);
  });

  it("computes silence_measured, silence_silent, and silence_rate", () => {
    const now = new Date("2026-08-20T00:00:00.000Z");
    const rows = [
      row({
        sender_email: "silent@example.com",
        last_attempt: {
          attempted_at: "2026-08-01T00:00:00.000Z",
          status_code: 200,
          succeeded: true,
          silent_14d: true,
          silence_measured_at: "2026-08-15T00:00:00.000Z",
        },
      }),
      row({
        sender_email: "still-emailing@example.com",
        last_attempt: {
          attempted_at: "2026-08-01T00:00:00.000Z",
          status_code: 200,
          succeeded: true,
          silent_14d: false,
          silence_measured_at: "2026-08-15T00:00:00.000Z",
        },
      }),
      row({ sender_email: "not-measured@example.com", last_attempt: null }),
    ];

    const summary = summarize(rows, now);

    expect(summary.silence_measured).toBe(2);
    expect(summary.silence_silent).toBe(1);
    expect(summary.silence_rate).toBe(0.5);
  });

  it("silence_rate is null when nothing has been measured", () => {
    const rows = [row({ sender_email: "a@example.com" })];

    const summary = summarize(rows, new Date("2026-08-20T00:00:00.000Z"));

    expect(summary.silence_measured).toBe(0);
    expect(summary.silence_rate).toBeNull();
  });

  it("target is always 0.8", () => {
    const summary = summarize([], new Date("2026-08-20T00:00:00.000Z"));

    expect(summary.target).toBe(0.8);
  });
});

describe("loadUnsubscribePanel", () => {
  it("returns PanelData built from three result sets queried in order", async () => {
    const mockSql = vi.fn<NeonQueryFunction<false, false>>();
    mockSql.mockResolvedValueOnce([candidate({ sender_email: "a@example.com" })]);
    mockSql.mockResolvedValueOnce([]);
    mockSql.mockResolvedValueOnce([]);
    const now = new Date("2026-08-20T00:00:00.000Z");

    const result = await loadUnsubscribePanel(mockSql, now);

    expect(result).not.toBeNull();
    expect(result?.ok).toBe(true);
    expect(result?.generated_at).toBe(now.toISOString());
    expect(result?.rows).toHaveLength(1);
    expect(result?.rows[0].sender_email).toBe("a@example.com");
    expect(mockSql).toHaveBeenCalledTimes(3);
  });

  it("returns null when the candidates query rejects with code 42P01", async () => {
    const mockSql = vi.fn<NeonQueryFunction<false, false>>();
    mockSql.mockRejectedValueOnce({ code: "42P01" });

    const result = await loadUnsubscribePanel(mockSql);

    expect(result).toBeNull();
  });

  it("propagates any other error", async () => {
    const mockSql = vi.fn<NeonQueryFunction<false, false>>();
    mockSql.mockRejectedValueOnce(new Error("connection refused"));

    await expect(loadUnsubscribePanel(mockSql)).rejects.toThrow("connection refused");
  });
});

describe("vercel.json api allowlist", () => {
  it("includes gmail", () => {
    const raw = fs.readFileSync(path.join(process.cwd(), "vercel.json"), "utf-8");
    const config = JSON.parse(raw) as { routes: Array<{ src: string }> };
    const allowlistRoute = config.routes.find((route) => route.src.startsWith("/api/(?!"));

    expect(allowlistRoute).toBeDefined();
    expect(allowlistRoute?.src.includes("|gmail)")).toBe(true);
  });
});
