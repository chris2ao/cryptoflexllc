/**
 * Integration tests for POST /api/analytics/vitals
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");

describe("POST /api/analytics/vitals", () => {
  let mockSql: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const { getDb } = await import("@/lib/analytics");
    mockSql = vi.fn().mockResolvedValue([]);
    vi.mocked(getDb).mockReturnValue(mockSql);
  });

  it("should record a valid LCP metric", async () => {
    const request = new NextRequest("http://localhost/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        name: "LCP",
        value: 2500,
        rating: "good",
        path: "/blog/test-post",
        navigationType: "navigate",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(204);
    expect(mockSql).toHaveBeenCalledWith(
      expect.any(Array),
      "LCP",
      2500,
      "good",
      "/blog/test-post",
      "navigate"
    );
  });

  it("should record a valid INP metric", async () => {
    const request = new NextRequest("http://localhost/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        name: "INP",
        value: 150,
        rating: "needs-improvement",
        path: "/",
        navigationType: "reload",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(204);
    expect(mockSql).toHaveBeenCalledWith(
      expect.any(Array),
      "INP",
      150,
      "needs-improvement",
      "/",
      "reload"
    );
  });

  it("should record a valid CLS metric", async () => {
    const request = new NextRequest("http://localhost/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        name: "CLS",
        value: 0.05,
        rating: "good",
        path: "/blog",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(204);
    expect(mockSql).toHaveBeenCalledWith(
      expect.any(Array),
      "CLS",
      0.05,
      "good",
      "/blog",
      "navigate" // Default navigation type
    );
  });

  it("should reject invalid rating", async () => {
    const request = new NextRequest("http://localhost/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        name: "LCP",
        value: 2500,
        rating: "invalid-rating",
        path: "/test",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should reject path not starting with /", async () => {
    const request = new NextRequest("http://localhost/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        name: "LCP",
        value: 2500,
        rating: "good",
        path: "no-slash",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should reject path exceeding 500 characters", async () => {
    const longPath = "/" + "a".repeat(500);

    const request = new NextRequest("http://localhost/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        name: "LCP",
        value: 2500,
        rating: "good",
        path: longPath,
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should reject navigationType exceeding 30 characters", async () => {
    const request = new NextRequest("http://localhost/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        name: "LCP",
        value: 2500,
        rating: "good",
        path: "/test",
        navigationType: "a".repeat(40),
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should return 400 when metric name is invalid", async () => {
    const request = new NextRequest("http://localhost/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        name: "INVALID_METRIC",
        value: 2500,
        rating: "good",
        path: "/",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should return 400 when metric name is missing", async () => {
    const request = new NextRequest("http://localhost/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        value: 2500,
        rating: "good",
        path: "/",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });

  it("should accept all valid metric names", async () => {
    const validMetrics = ["LCP", "INP", "CLS", "FCP", "TTFB"];

    for (const metric of validMetrics) {
      vi.clearAllMocks();

      const request = new NextRequest("http://localhost/api/analytics/vitals", {
        method: "POST",
        body: JSON.stringify({
          name: metric,
          value: 100,
          rating: "good",
          path: "/",
        }),
        headers: { "content-type": "application/json" },
      });

      const response = await POST(request);
      expect(response.status).toBe(204);
      expect(mockSql).toHaveBeenCalled();
    }
  });

  it("should return 400 when value is not a number", async () => {
    const request = new NextRequest("http://localhost/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        name: "LCP",
        value: "not-a-number",
        rating: "good",
        path: "/",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });

  it("should return 400 when value is negative", async () => {
    const request = new NextRequest("http://localhost/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        name: "LCP",
        value: -100,
        rating: "good",
        path: "/",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });

  it("should return 400 when value is Infinity", async () => {
    const request = new NextRequest("http://localhost/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        name: "LCP",
        value: Infinity,
        rating: "good",
        path: "/",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });

  it("should accept zero as a valid value", async () => {
    const request = new NextRequest("http://localhost/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        name: "CLS",
        value: 0,
        rating: "good",
        path: "/",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(204);
    expect(mockSql).toHaveBeenCalledWith(
      expect.any(Array),
      "CLS",
      0,
      "good",
      "/",
      "navigate"
    );
  });

  it("should return 500 when database query fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("Database error"));

    const request = new NextRequest("http://localhost/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        name: "LCP",
        value: 2500,
        rating: "good",
        path: "/",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to record vitals");
  });

  it("should handle malformed JSON body", async () => {
    const request = new NextRequest("http://localhost/api/analytics/vitals", {
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
