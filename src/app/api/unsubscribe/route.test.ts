/**
 * Integration tests for GET /api/unsubscribe
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "./route";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");

describe("GET /api/unsubscribe", () => {
  let mockSql: any;
  const testSecret = "test-secret-key";

  beforeEach(async () => {
    vi.clearAllMocks();

    const { getDb } = await import("@/lib/analytics");
    mockSql = vi.fn();
    vi.mocked(getDb).mockReturnValue(mockSql);

    process.env.SUBSCRIBER_SECRET = testSecret;
  });

  afterEach(() => {
    delete process.env.SUBSCRIBER_SECRET;
  });

  it("should unsubscribe with valid email and token", async () => {
    mockSql.mockResolvedValueOnce([]);

    const { makeUnsubscribeToken } = await import("@/lib/subscribers");
    const email = "user@example.com";
    const token = makeUnsubscribeToken(email);

    const request = new NextRequest(
      `http://localhost/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
    );

    const response = await GET(request);
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/html");
    expect(text).toContain("Unsubscribed");
    expect(text).toContain("You have been unsubscribed");

    expect(mockSql).toHaveBeenCalledWith(
      expect.any(Array),
      email
    );
  });

  it("should normalize email to lowercase", async () => {
    mockSql.mockResolvedValueOnce([]);

    const { makeUnsubscribeToken } = await import("@/lib/subscribers");
    const email = "USER@EXAMPLE.COM";
    const normalizedEmail = "user@example.com";
    const token = makeUnsubscribeToken(normalizedEmail);

    const request = new NextRequest(
      `http://localhost/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockSql).toHaveBeenCalledWith(
      expect.any(Array),
      normalizedEmail
    );
  });

  it("should return 400 when email parameter is missing", async () => {
    const token = Buffer.from("token-for-test@example.com").toString("hex");

    const request = new NextRequest(
      `http://localhost/api/unsubscribe?token=${token}`
    );

    const response = await GET(request);
    const text = await response.text();

    expect(response.status).toBe(400);
    expect(text).toContain("Invalid link");
    expect(text).toContain("The unsubscribe link is invalid or expired");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should return 400 when token parameter is missing", async () => {
    const request = new NextRequest(
      "http://localhost/api/unsubscribe?email=user@example.com"
    );

    const response = await GET(request);
    const text = await response.text();

    expect(response.status).toBe(400);
    expect(text).toContain("Invalid link");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should return 400 when both parameters are missing", async () => {
    const request = new NextRequest("http://localhost/api/unsubscribe");

    const response = await GET(request);
    const text = await response.text();

    expect(response.status).toBe(400);
    expect(text).toContain("Invalid link");
  });

  it("should return 403 when token is invalid", async () => {
    const email = "user@example.com";
    const wrongToken = "0".repeat(64); // Invalid hex token (wrong HMAC)

    const request = new NextRequest(
      `http://localhost/api/unsubscribe?email=${encodeURIComponent(email)}&token=${wrongToken}`
    );

    const response = await GET(request);
    const text = await response.text();

    expect(response.status).toBe(403);
    expect(text).toContain("Invalid link");
    expect(text).toContain("The unsubscribe link is invalid or expired");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should return 403 when token is for a different email", async () => {
    const { makeUnsubscribeToken } = await import("@/lib/subscribers");
    const email = "user@example.com";
    const otherEmail = "other@example.com";
    const tokenForOther = makeUnsubscribeToken(otherEmail);

    const request = new NextRequest(
      `http://localhost/api/unsubscribe?email=${encodeURIComponent(email)}&token=${tokenForOther}`
    );

    const response = await GET(request);
    const text = await response.text();

    expect(response.status).toBe(403);
    expect(text).toContain("Invalid link");
  });

  it("should return HTML page with proper structure", async () => {
    mockSql.mockResolvedValueOnce([]);

    const { makeUnsubscribeToken } = await import("@/lib/subscribers");
    const email = "user@example.com";
    const token = makeUnsubscribeToken(email);

    const request = new NextRequest(
      `http://localhost/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
    );

    const response = await GET(request);
    const text = await response.text();

    expect(text).toContain("<!DOCTYPE html>");
    expect(text).toContain('<html lang="en">');
    expect(text).toContain("CryptoFlex LLC");
    expect(text).toContain("Back to the blog");
    expect(text).toContain("https://www.cryptoflexllc.com/blog");
  });

  it("should return 500 when database query fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("Database error"));

    const { makeUnsubscribeToken } = await import("@/lib/subscribers");
    const email = "user@example.com";
    const token = makeUnsubscribeToken(email);

    const request = new NextRequest(
      `http://localhost/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
    );

    const response = await GET(request);
    const text = await response.text();

    expect(response.status).toBe(500);
    expect(text).toContain("Error");
    expect(text).toContain("Something went wrong");
  });
});
