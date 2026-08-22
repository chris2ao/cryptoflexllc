/**
 * Integration tests for /api/gmail/unsubscribe/decisions
 * (GET: agent bearer auth, POST: operator cookie auth)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");
vi.mock("@/lib/analytics-auth");
// Partial mock: only verifyGmailAgentAuth is stubbed per test. agentAuthErrorBody
// is pure (no I/O) and stays real so tests assert the actual response text.
vi.mock("@/lib/gmail-agent-auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/gmail-agent-auth")>();
  return { ...actual, verifyGmailAgentAuth: vi.fn() };
});
vi.mock("@/lib/rate-limit");

function makeGetRequest(query = "") {
  return new NextRequest(
    `http://localhost/api/gmail/unsubscribe/decisions${query}`,
    { headers: { authorization: "Bearer test-token" } }
  );
}

function makePostRequest(body: unknown) {
  return new NextRequest("http://localhost/api/gmail/unsubscribe/decisions", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { "content-type": "application/json", cookie: "analytics_session=test" },
  });
}

describe("/api/gmail/unsubscribe/decisions", () => {
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

    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);
  });

  describe("GET", () => {
    it("returns 401 without the bearer", async () => {
      const { verifyGmailAgentAuth } = await import("@/lib/gmail-agent-auth");
      vi.mocked(verifyGmailAgentAuth).mockReturnValue({ ok: false, status: 401 });

      const { GET } = await import("./route");
      const response = await GET(makeGetRequest());
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
      expect(mockSql).not.toHaveBeenCalled();
    });

    it("returns 503 when the auth helper reports unconfigured", async () => {
      const { verifyGmailAgentAuth } = await import("@/lib/gmail-agent-auth");
      vi.mocked(verifyGmailAgentAuth).mockReturnValue({ ok: false, status: 503 });

      const { GET } = await import("./route");
      const response = await GET(makeGetRequest());
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe("Agent API not configured");
    });

    it("returns 429 when the rate limiter denies", async () => {
      const { createRateLimiter } = await import("@/lib/rate-limit");
      vi.mocked(createRateLimiter).mockReturnValue({
        checkRateLimit: vi
          .fn()
          .mockResolvedValue({ allowed: false, remaining: 0, retryAfter: 5 }),
        store: new Map(),
      });

      const { GET } = await import("./route");
      const response = await GET(makeGetRequest());

      expect(response.status).toBe(429);
      expect(response.headers.get("Retry-After")).toBe("5");
    });

    it("returns the latest decision per sender", async () => {
      mockSql.mockResolvedValueOnce([
        {
          id: 2,
          sender_email: "a@example.com",
          decision: "approve",
          decided_at: "2026-08-15T00:00:00.000Z",
          note: null,
        },
        {
          id: 3,
          sender_email: "b@example.com",
          decision: "deny",
          decided_at: "2026-08-16T00:00:00.000Z",
          note: "keep",
        },
      ]);

      const { GET } = await import("./route");
      const response = await GET(makeGetRequest());
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.decisions).toEqual([
        {
          id: 2,
          sender_email: "a@example.com",
          decision: "approve",
          decided_at: "2026-08-15T00:00:00.000Z",
          note: null,
        },
        {
          id: 3,
          sender_email: "b@example.com",
          decision: "deny",
          decided_at: "2026-08-16T00:00:00.000Z",
          note: "keep",
        },
      ]);
      expect(data.ledger).toBeUndefined();
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it("sets Cache-Control: no-store on success", async () => {
      mockSql.mockResolvedValueOnce([]);

      const { GET } = await import("./route");
      const response = await GET(makeGetRequest());

      expect(response.headers.get("Cache-Control")).toBe("no-store");
    });

    it("bounds the full ledger query to the newest 5000 rows", async () => {
      mockSql.mockResolvedValueOnce([]);

      const { GET } = await import("./route");
      await GET(makeGetRequest("?full=1"));

      const [strings] = mockSql.mock.calls[0];
      expect((strings as string[]).join("")).toContain("LIMIT 5000");
    });

    it("adds the ledger when ?full=1, keeping only the latest per sender in decisions", async () => {
      mockSql.mockResolvedValueOnce([
        {
          id: 5,
          sender_email: "a@example.com",
          decision: "approve",
          decided_at: "2026-08-16T00:00:00.000Z",
          note: null,
        },
        {
          id: 4,
          sender_email: "a@example.com",
          decision: "deny",
          decided_at: "2026-08-15T00:00:00.000Z",
          note: "earlier",
        },
      ]);

      const { GET } = await import("./route");
      const response = await GET(makeGetRequest("?full=1"));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.decisions).toHaveLength(1);
      expect(data.decisions[0].id).toBe(5);
      expect(data.ledger).toHaveLength(2);
      expect(mockSql).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST", () => {
    it("returns 401 without the cookie", async () => {
      const { verifyApiAuth } = await import("@/lib/analytics-auth");
      vi.mocked(verifyApiAuth).mockReturnValue(false);

      const { POST } = await import("./route");
      const response = await POST(
        makePostRequest({ sender_email: "a@example.com", decision: "approve" })
      );
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
      expect(mockSql).not.toHaveBeenCalled();
    });

    it("returns 429 when the rate limiter denies, using the POST-specific limiter (30/min vs 60/min for GET)", async () => {
      const { createRateLimiter } = await import("@/lib/rate-limit");
      vi.mocked(createRateLimiter).mockReturnValue({
        checkRateLimit: vi
          .fn()
          .mockResolvedValue({ allowed: false, remaining: 0, retryAfter: 11 }),
        store: new Map(),
      });

      const { POST } = await import("./route");
      const response = await POST(
        makePostRequest({ sender_email: "a@example.com", decision: "approve" })
      );

      expect(response.status).toBe(429);
      expect(response.headers.get("Retry-After")).toBe("11");
      expect(createRateLimiter).toHaveBeenCalledWith(
        expect.objectContaining({ name: "gmail-unsub-decisions-get", maxRequests: 60 })
      );
      expect(createRateLimiter).toHaveBeenCalledWith(
        expect.objectContaining({ name: "gmail-unsub-decisions-post", maxRequests: 30 })
      );
    });

    it("returns 400 on a bad body", async () => {
      const { POST } = await import("./route");
      const response = await POST(makePostRequest({ sender_email: "not-an-email" }));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid payload");
      expect(mockSql).not.toHaveBeenCalled();
    });

    it("returns 404 when the sender is not a candidate", async () => {
      mockSql.mockResolvedValueOnce([]);

      const { POST } = await import("./route");
      const response = await POST(
        makePostRequest({ sender_email: "a@example.com", decision: "approve" })
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Unknown sender");
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it("inserts one ledger row and returns it", async () => {
      mockSql.mockResolvedValueOnce([{ exists: 1 }]).mockResolvedValueOnce([
        {
          id: 9,
          sender_email: "a@example.com",
          decision: "approve",
          decided_at: "2026-08-20T00:00:00.000Z",
          note: null,
        },
      ]);

      const { POST } = await import("./route");
      const response = await POST(
        makePostRequest({ sender_email: "A@Example.com", decision: "approve" })
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        ok: true,
        decision: {
          id: 9,
          sender_email: "a@example.com",
          decision: "approve",
          decided_at: "2026-08-20T00:00:00.000Z",
          note: null,
        },
      });
      expect(mockSql).toHaveBeenCalledTimes(2);
    });
  });
});
