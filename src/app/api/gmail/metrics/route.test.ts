/**
 * Integration tests for POST /api/gmail/metrics
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");
// Partial mock: only verifyGmailAgentAuth is stubbed per test. agentAuthErrorBody
// is pure (no I/O) and stays real so tests assert the actual response text.
vi.mock("@/lib/gmail-agent-auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/gmail-agent-auth")>();
  return { ...actual, verifyGmailAgentAuth: vi.fn() };
});
vi.mock("@/lib/rate-limit");

const VALID_RUN = {
  run_id: "13292a94-99d3-439c-b8a9-2a49991c55fe",
  started_at: "2026-09-22T12:08:02.498068+00:00",
  ended_at: "2026-09-22T12:11:02.111476+00:00",
  status: "success",
  duration_seconds: 180,
  messages_scanned: 11,
  messages_trashed: 5,
  messages_archived: 4,
  messages_flagged: 0,
};

const VALID_SESSION = {
  id: "2026-09-",
  date: "2026-09-22",
  time: "08:10",
  sizeBytes: 91792,
  sizeMB: "0.09",
};

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/gmail/metrics", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { authorization: "Bearer test-token", ...headers },
  });
}

describe("POST /api/gmail/metrics", () => {
  let mockSql: any;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    const { getDb } = await import("@/lib/analytics");
    mockSql = vi.fn().mockResolvedValue([]);
    vi.mocked(getDb).mockReturnValue(mockSql);

    const { createRateLimiter, getClientIp } = await import("@/lib/rate-limit");
    vi.mocked(createRateLimiter).mockReturnValue({
      checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 9 }),
      store: new Map(),
    });
    vi.mocked(getClientIp).mockReturnValue("127.0.0.1");

    const { verifyGmailAgentAuth } = await import("@/lib/gmail-agent-auth");
    vi.mocked(verifyGmailAgentAuth).mockReturnValue({ ok: true });
  });

  it("returns 503 when the auth helper reports unconfigured", async () => {
    const { verifyGmailAgentAuth } = await import("@/lib/gmail-agent-auth");
    vi.mocked(verifyGmailAgentAuth).mockReturnValue({ ok: false, status: 503 });

    const { POST } = await import("./route");
    const response = await POST(
      makeRequest({ gmailMetrics: [VALID_RUN], sessionArchive: [VALID_SESSION] })
    );
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toBe("Agent API not configured");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("returns 401 on a bad or missing token", async () => {
    const { verifyGmailAgentAuth } = await import("@/lib/gmail-agent-auth");
    vi.mocked(verifyGmailAgentAuth).mockReturnValue({ ok: false, status: 401 });

    const { POST } = await import("./route");
    const response = await POST(
      makeRequest({ gmailMetrics: [VALID_RUN], sessionArchive: [VALID_SESSION] })
    );
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("returns 429 when the rate limiter denies, with Retry-After", async () => {
    const { createRateLimiter } = await import("@/lib/rate-limit");
    vi.mocked(createRateLimiter).mockReturnValue({
      checkRateLimit: vi
        .fn()
        .mockResolvedValue({ allowed: false, remaining: 0, retryAfter: 42 }),
      store: new Map(),
    });

    const { POST } = await import("./route");
    const response = await POST(
      makeRequest({ gmailMetrics: [VALID_RUN], sessionArchive: [VALID_SESSION] })
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("42");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("returns 413 when the body exceeds the cap even if content-length understates it", async () => {
    const { POST } = await import("./route");
    const oversized = JSON.stringify({
      gmailMetrics: [],
      sessionArchive: [],
      padding: "x".repeat(4 * 1024 * 1024 + 1),
    });
    const response = await POST(makeRequest(oversized, { "content-length": "10" }));
    const data = await response.json();

    expect(response.status).toBe(413);
    expect(data.error).toBe("Payload too large");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("returns 413 when content-length exceeds 4 MB", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      makeRequest(
        { gmailMetrics: [VALID_RUN], sessionArchive: [VALID_SESSION] },
        { "content-length": String(4 * 1024 * 1024 + 1) }
      )
    );
    const data = await response.json();

    expect(response.status).toBe(413);
    expect(data.error).toBe("Payload too large");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("returns 400 on invalid JSON", async () => {
    const { POST } = await import("./route");
    const response = await POST(makeRequest("{not json"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid JSON");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("returns 400 on a Zod validation failure", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      makeRequest({ gmailMetrics: [{ run_id: "abc" }], sessionArchive: [] })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid payload");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("returns 400 when a required top-level key is missing", async () => {
    const { POST } = await import("./route");
    const response = await POST(makeRequest({ gmailMetrics: [VALID_RUN] }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid payload");
  });

  it("upserts both snapshots and returns counts on success", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      makeRequest({ gmailMetrics: [VALID_RUN], sessionArchive: [VALID_SESSION] })
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true, gmailRuns: 1, sessionEntries: 1 });
    // putSnapshot also issues CREATE TABLE IF NOT EXISTS; check the upserts.
    const inserts = (mockSql.mock.calls as unknown[][]).filter((call) =>
      (call[0] as string[]).join(" ").includes("INSERT INTO automation_snapshots")
    );
    expect(inserts).toHaveLength(2);
    expect(inserts.map((call) => call[1])).toEqual(["gmail-metrics", "session-archive"]);
  });

  it("accepts empty arrays for both fields", async () => {
    const { POST } = await import("./route");
    const response = await POST(makeRequest({ gmailMetrics: [], sessionArchive: [] }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true, gmailRuns: 0, sessionEntries: 0 });
  });

  it("returns 500 and logs a generic message (no payload contents) on a db error", async () => {
    mockSql.mockRejectedValue(new Error("connection reset"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { POST } = await import("./route");
    const response = await POST(
      makeRequest({ gmailMetrics: [VALID_RUN], sessionArchive: [VALID_SESSION] })
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal error");
    expect(errorSpy).toHaveBeenCalledWith("gmail/metrics: db error");
    for (const call of errorSpy.mock.calls) {
      expect(JSON.stringify(call)).not.toContain(VALID_RUN.run_id);
    }

    errorSpy.mockRestore();
  });
});
