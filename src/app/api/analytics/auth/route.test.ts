import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/analytics-auth");
vi.mock("@/lib/rate-limit", () => ({
  createRateLimiter: () => ({
    checkRateLimit: () => Promise.resolve({ allowed: true, remaining: 5 }),
  }),
  getClientIp: () => "127.0.0.1",
}));

describe("POST /api/analytics/auth", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("should return 401 when ANALYTICS_SECRET env is not set", async () => {
    delete process.env.ANALYTICS_SECRET;

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/analytics/auth", {
      method: "POST",
      body: JSON.stringify({ secret: "test-secret" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 400 when secret is not provided in body", async () => {
    process.env.ANALYTICS_SECRET = "correct-secret";

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/analytics/auth", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });

  it("should return 401 when secret does not match", async () => {
    process.env.ANALYTICS_SECRET = "correct-secret";

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/analytics/auth", {
      method: "POST",
      body: JSON.stringify({ secret: "wrong--secret" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 401 when secret has different length", async () => {
    process.env.ANALYTICS_SECRET = "correct-secret";

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/analytics/auth", {
      method: "POST",
      body: JSON.stringify({ secret: "short" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return success and set cookie with valid secret", async () => {
    process.env.ANALYTICS_SECRET = "correct-secret";

    const { generateAuthToken } = await import("@/lib/analytics-auth");
    vi.mocked(generateAuthToken).mockReturnValue("generated-token");

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/analytics/auth", {
      method: "POST",
      body: JSON.stringify({ secret: "correct-secret" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    // Check cookie via Set-Cookie header
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain("generated-token");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=strict");
    expect(setCookie).toContain("Path=/");
  });

  it("should handle malformed JSON body", async () => {
    process.env.ANALYTICS_SECRET = "correct-secret";

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/analytics/auth", {
      method: "POST",
      body: "invalid-json",
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });

  it("should return 400 for non-string secret value", async () => {
    process.env.ANALYTICS_SECRET = "correct-secret";

    const { POST } = await import("./route");
    const request = new Request("http://localhost/api/analytics/auth", {
      method: "POST",
      body: JSON.stringify({ secret: 12345 }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });
});
