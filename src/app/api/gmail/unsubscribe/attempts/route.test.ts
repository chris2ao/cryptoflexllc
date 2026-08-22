/**
 * Integration tests for POST /api/gmail/unsubscribe/attempts
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");
vi.mock("@/lib/gmail-agent-auth");
vi.mock("@/lib/rate-limit");

const VALID_ITEM = {
  sender_email: "News@Example.com",
  attempted_at: "2026-08-15T00:00:00.000Z",
  status_code: 200,
  succeeded: true,
  silent_14d: null,
  silence_measured_at: null,
};

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/gmail/unsubscribe/attempts", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { authorization: "Bearer test-token" },
  });
}

describe("POST /api/gmail/unsubscribe/attempts", () => {
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
    const response = await POST(makeRequest({ items: [VALID_ITEM] }));

    expect(response.status).toBe(503);
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("returns 401 on a bad token", async () => {
    const { verifyGmailAgentAuth } = await import("@/lib/gmail-agent-auth");
    vi.mocked(verifyGmailAgentAuth).mockReturnValue({ ok: false, status: 401 });

    const { POST } = await import("./route");
    const response = await POST(makeRequest({ items: [VALID_ITEM] }));
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
        .mockResolvedValue({ allowed: false, remaining: 0, retryAfter: 17 }),
      store: new Map(),
    });

    const { POST } = await import("./route");
    const response = await POST(makeRequest({ items: [VALID_ITEM] }));

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("17");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("returns 400 on a raw body containing https:// before any DB call", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      makeRequest(
        '{"items":[{"sender_email":"a@example.com","note":"see https://evil.example"}]}'
      )
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Payload contains forbidden content");
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
      makeRequest({ items: [{ sender_email: "not-an-email" }] })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid payload");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("upserts with a single UNNEST call and the (sender_email, attempted_at) conflict target", async () => {
    const { POST } = await import("./route");
    const response = await POST(makeRequest({ items: [VALID_ITEM] }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true, upserted: 1 });
    expect(mockSql).toHaveBeenCalledTimes(1);

    const [strings, senderEmails] = mockSql.mock.calls[0];
    expect(senderEmails).toEqual(["news@example.com"]);
    const sqlText = strings.join(" ").replace(/\s+/g, " ");
    expect(sqlText).toContain("ON CONFLICT (sender_email, attempted_at)");
    expect(sqlText).toContain("COALESCE(EXCLUDED.silent_14d");
    expect(sqlText).toContain("COALESCE( EXCLUDED.silence_measured_at");
  });
});
