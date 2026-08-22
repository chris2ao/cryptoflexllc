/**
 * Integration tests for POST /api/gmail/unsubscribe/candidates
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

const VALID_ITEM = {
  sender_email: "News@Example.com",
  sender_domain: "Example.com",
  method: "rfc8058-post",
  trashed_count_14d: 3,
  first_seen: "2026-08-01T00:00:00.000Z",
  last_seen: "2026-08-10T00:00:00.000Z",
};

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/gmail/unsubscribe/candidates", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { authorization: "Bearer test-token", ...headers },
  });
}

describe("POST /api/gmail/unsubscribe/candidates", () => {
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
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toBe("Agent API not configured");
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
        .mockResolvedValue({ allowed: false, remaining: 0, retryAfter: 42 }),
      store: new Map(),
    });

    const { POST } = await import("./route");
    const response = await POST(makeRequest({ items: [VALID_ITEM] }));

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("42");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("returns 413 when content-length exceeds 1 MB", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      makeRequest({ items: [VALID_ITEM] }, { "content-length": String(1_048_577) })
    );
    const data = await response.json();

    expect(response.status).toBe(413);
    expect(data.error).toBe("Payload too large");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("returns 400 on a raw body containing https:// before any DB call, logging the item index", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { POST } = await import("./route");
    const response = await POST(
      makeRequest(
        '{"items":[{"sender_email":"a@example.com","sender_domain":"https://evil.example"}]}'
      )
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Payload contains forbidden content");
    expect(mockSql).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(
      "gmail/unsubscribe/candidates: forbidden content at item 0"
    );

    errorSpy.mockRestore();
  });

  it("logs a fallback line when the offending item cannot be located", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { POST } = await import("./route");
    const response = await POST(makeRequest("not json but has https://evil.example inside"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Payload contains forbidden content");
    expect(errorSpy).toHaveBeenCalledWith(
      "gmail/unsubscribe/candidates: forbidden content, item unknown"
    );

    errorSpy.mockRestore();
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

  it("upserts with a single UNNEST call and lowercases emails", async () => {
    const { POST } = await import("./route");
    const response = await POST(makeRequest({ items: [VALID_ITEM] }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true, upserted: 1 });
    expect(mockSql).toHaveBeenCalledTimes(1);

    const call = mockSql.mock.calls[0];
    const [strings, senderEmails, senderDomains] = call;
    expect(senderEmails).toEqual(["news@example.com"]);
    expect(senderDomains).toEqual(["example.com"]);
    const sqlText = strings.join(" ");
    expect(sqlText).toContain("ON CONFLICT (sender_email)");
    expect(sqlText).toContain("LEAST(");
    expect(sqlText).toContain("GREATEST(");
  });

  it("dedupes items with the same sender_email, keeping only the last occurrence", async () => {
    const older = { ...VALID_ITEM, trashed_count_14d: 1 };
    const newer = { ...VALID_ITEM, trashed_count_14d: 9 };

    const { POST } = await import("./route");
    const response = await POST(makeRequest({ items: [older, newer] }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true, upserted: 1 });
    expect(mockSql).toHaveBeenCalledTimes(1);

    // call args: [strings, senderEmails, senderDomains, methods, trashedCounts, firstSeens, lastSeens]
    const call = mockSql.mock.calls[0];
    expect(call[1]).toEqual(["news@example.com"]);
    expect(call[4]).toEqual([9]);
  });

  it("is idempotent on a second identical push", async () => {
    const { POST } = await import("./route");
    const first = await POST(makeRequest({ items: [VALID_ITEM] }));
    const second = await POST(makeRequest({ items: [VALID_ITEM] }));
    const firstData = await first.json();
    const secondData = await second.json();

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(firstData).toEqual(secondData);
    expect(mockSql).toHaveBeenCalledTimes(2);
    expect(mockSql.mock.calls[0]).toEqual(mockSql.mock.calls[1]);
  });
});
