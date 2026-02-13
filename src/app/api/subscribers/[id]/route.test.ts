/**
 * Integration tests for DELETE /api/subscribers/:id
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { DELETE } from "./route";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");
vi.mock("@/lib/analytics-auth");

describe("DELETE /api/subscribers/:id", () => {
  let mockSql: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const { getDb } = await import("@/lib/analytics");
    mockSql = vi.fn();
    vi.mocked(getDb).mockReturnValue(mockSql);
  });

  it("should delete a subscriber and cascade comments when authenticated", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    // Mock subscriber deletion
    mockSql.mockResolvedValueOnce([
      { id: 10, email: "user@example.com" },
    ]);

    // Mock cascade comment deletion
    mockSql.mockResolvedValueOnce([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);

    const request = new NextRequest(
      "http://localhost/api/subscribers/10",
      { method: "DELETE" }
    );
    const params = Promise.resolve({ id: "10" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      ok: true,
      deleted: { id: 10, email: "user@example.com" },
      commentsRemoved: 3,
    });

    expect(mockSql).toHaveBeenCalledTimes(2);
    // First call deletes subscriber
    expect(mockSql).toHaveBeenNthCalledWith(1, expect.any(Array), 10);
    // Second call deletes comments by email
    expect(mockSql).toHaveBeenNthCalledWith(2, expect.any(Array), "user@example.com");
  });

  it("should return 0 commentsRemoved when subscriber has no comments", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    mockSql.mockResolvedValueOnce([
      { id: 10, email: "user@example.com" },
    ]);
    mockSql.mockResolvedValueOnce([]); // No comments to delete

    const request = new NextRequest(
      "http://localhost/api/subscribers/10",
      { method: "DELETE" }
    );
    const params = Promise.resolve({ id: "10" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.commentsRemoved).toBe(0);
  });

  it("should return 401 when not authenticated", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(false);

    const request = new NextRequest(
      "http://localhost/api/subscribers/10",
      { method: "DELETE" }
    );
    const params = Promise.resolve({ id: "10" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should return 400 when ID is not a number", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const request = new NextRequest(
      "http://localhost/api/subscribers/abc",
      { method: "DELETE" }
    );
    const params = Promise.resolve({ id: "abc" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid subscriber ID.");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should return 400 when ID is negative", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const request = new NextRequest(
      "http://localhost/api/subscribers/-5",
      { method: "DELETE" }
    );
    const params = Promise.resolve({ id: "-5" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid subscriber ID.");
  });

  it("should return 404 when subscriber does not exist", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    mockSql.mockResolvedValueOnce([]); // No subscriber found

    const request = new NextRequest(
      "http://localhost/api/subscribers/999",
      { method: "DELETE" }
    );
    const params = Promise.resolve({ id: "999" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Subscriber not found.");

    // Should not try to delete comments if subscriber doesn't exist
    expect(mockSql).toHaveBeenCalledTimes(1);
  });

  it("should return 500 when database query fails", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    mockSql.mockRejectedValueOnce(new Error("Database error"));

    const request = new NextRequest(
      "http://localhost/api/subscribers/10",
      { method: "DELETE" }
    );
    const params = Promise.resolve({ id: "10" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to delete subscriber.");
  });
});
