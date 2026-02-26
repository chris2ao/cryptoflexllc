/**
 * Integration tests for POST /api/subscribe
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/analytics");
vi.mock("@/lib/blog");
vi.mock("nodemailer");
vi.mock("@/lib/rate-limit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/rate-limit")>();
  return {
    ...actual,
    createRateLimiter: () => ({
      checkRateLimit: () => ({ allowed: true, remaining: 5 }),
    }),
  };
});
vi.mock("@/lib/email-retry", () => ({
  withRetry: vi.fn((fn: () => Promise<unknown>) => fn()),
}));

describe("POST /api/subscribe", () => {
  let mockSql: any;
  let mockTransporter: any;

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock getDb to return a SQL tagged template function
    const { getDb } = await import("@/lib/analytics");
    mockSql = vi.fn((_strings: TemplateStringsArray, ..._values: any[]) =>
      Promise.resolve([])
    );
    vi.mocked(getDb).mockReturnValue(mockSql);

    // Mock nodemailer
    const nodemailer = await import("nodemailer");
    mockTransporter = {
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
    };
    vi.mocked(nodemailer.default.createTransport).mockReturnValue(
      mockTransporter as any
    );

    // Mock getAllPosts
    const { getAllPosts } = await import("@/lib/blog");
    vi.mocked(getAllPosts).mockReturnValue([
      {
        slug: "test-post-1",
        title: "Test Post 1",
        date: "2026-02-01",
        description: "Test description 1",
        tags: ["test"],
        readingTime: "5 min read",
        author: "",
        content: "",
      },
      {
        slug: "test-post-2",
        title: "Test Post 2",
        date: "2026-02-02",
        description: "Test description 2",
        tags: [],
        readingTime: "3 min read",
        author: "",
        content: "",
      },
    ]);

    // Set required env vars
    process.env.GMAIL_USER = "test@cryptoflexllc.com";
    process.env.GMAIL_APP_PASSWORD = "test-password";
    process.env.SUBSCRIBER_SECRET = "test-secret";
  });

  afterEach(() => {
    delete process.env.GMAIL_USER;
    delete process.env.GMAIL_APP_PASSWORD;
    delete process.env.SUBSCRIBER_SECRET;
  });

  it("should successfully subscribe a valid email", async () => {
    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.1",
        "x-vercel-ip-country": "US",
        "x-vercel-ip-city": "New%20York",
        "x-vercel-ip-country-region": "NY",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true });

    // Verify SQL was called with correct parameters
    // Parameters: email, ipAddress, country, city, region, ipAddress, country, city, region (repeated for ON CONFLICT)
    const sqlCall = mockSql.mock.calls[0];
    expect(sqlCall[1]).toBe("user@example.com"); // email
    expect(sqlCall[2]).toBe("203.0.113.1"); // ip_address
    expect(sqlCall[3]).toBe("US"); // country
    expect(sqlCall[4]).toBe("New York"); // city
    expect(sqlCall[5]).toBe("NY"); // region
  });

  it("should normalize email to lowercase and trim whitespace", async () => {
    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "USER@EXAMPLE.COM" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true });

    // Verify SQL was called with normalized email
    const sqlCall = mockSql.mock.calls[0];
    expect(sqlCall[1]).toBe("user@example.com");
  });

  it("should reject empty email", async () => {
    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should reject invalid email format", async () => {
    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "not-an-email" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should reject missing email field", async () => {
    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });

  it("should extract IP from x-forwarded-for header", async () => {
    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.1, 198.51.100.1",
      },
    });

    await POST(request);

    // Verify SQL was called with first IP from the list
    const sqlCall = mockSql.mock.calls[0];
    expect(sqlCall[1]).toBe("user@example.com");
    expect(sqlCall[2]).toBe("203.0.113.1"); // First IP in the list
  });

  it("should fallback to x-real-ip if x-forwarded-for is missing", async () => {
    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: {
        "content-type": "application/json",
        "x-real-ip": "198.51.100.1",
      },
    });

    await POST(request);

    // Verify SQL was called with x-real-ip
    const sqlCall = mockSql.mock.calls[0];
    expect(sqlCall[1]).toBe("user@example.com");
    expect(sqlCall[2]).toBe("198.51.100.1");
  });

  it("should decode Vercel geo headers", async () => {
    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: {
        "content-type": "application/json",
        "x-vercel-ip-country": "United%20States",
        "x-vercel-ip-city": "San%20Francisco",
        "x-vercel-ip-country-region": "California",
      },
    });

    await POST(request);

    // Verify SQL was called with decoded geo headers
    const sqlCall = mockSql.mock.calls[0];
    expect(sqlCall[1]).toBe("user@example.com");
    expect(sqlCall[3]).toBe("United States");
    expect(sqlCall[4]).toBe("San Francisco");
    expect(sqlCall[5]).toBe("California");
  });

  it("should send confirmation email when credentials are configured", async () => {
    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: { "content-type": "application/json" },
    });

    await POST(request);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: '"CryptoFlex LLC" <test@cryptoflexllc.com>',
        to: "user@example.com",
        subject: "Welcome to CryptoFlex! Thanks for Subscribing",
        html: expect.stringContaining("Welcome to CryptoFlex!"),
        headers: expect.objectContaining({
          "List-Unsubscribe": expect.stringContaining("/api/unsubscribe"),
        }),
      })
    );
  });

  it("should skip email when GMAIL_USER is not configured", async () => {
    delete process.env.GMAIL_USER;

    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(mockTransporter.sendMail).not.toHaveBeenCalled();
  });

  it("should skip email when GMAIL_APP_PASSWORD is not configured", async () => {
    delete process.env.GMAIL_APP_PASSWORD;

    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(mockTransporter.sendMail).not.toHaveBeenCalled();
  });

  it("should succeed even if email sending fails", async () => {
    mockTransporter.sendMail.mockRejectedValueOnce(
      new Error("SMTP connection failed")
    );

    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    // Should still return 200 even if email fails
    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true });
  });

  it("should return 502 when database operation fails after retries", async () => {
    const dbError = new Error("Database connection failed");
    mockSql.mockRejectedValue(dbError);

    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(502);
    expect(data.error).toBe("Unable to save your subscription. Please try again in a moment.");
    // Verify all retry attempts were made (1 original + 2 retries = 3 calls)
    expect(mockSql).toHaveBeenCalledTimes(3);
  });

  it("should succeed on retry after transient DB failure", async () => {
    mockSql
      .mockRejectedValueOnce(new Error("Connection timeout"))
      .mockResolvedValueOnce([]);

    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true });
    expect(mockSql).toHaveBeenCalledTimes(2);
  });

  it("should handle malformed JSON body", async () => {
    const request = new NextRequest("http://localhost/api/subscribe", {
      method: "POST",
      body: "not-valid-json",
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });
});
