/**
 * Integration tests for DELETE /api/comments/:id
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { DELETE } from "./route";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");
vi.mock("@/lib/analytics-auth");

describe("DELETE /api/comments/:id", () => {
  let mockSql: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const { getDb } = await import("@/lib/analytics");
    mockSql = vi.fn();
    vi.mocked(getDb).mockReturnValue(mockSql);
  });

  it("should delete a comment when authenticated", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    mockSql.mockResolvedValueOnce([{ id: 5 }]);

    const request = new NextRequest(
      "http://localhost/api/comments/5",
      { method: "DELETE" }
    );
    const params = Promise.resolve({ id: "5" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true, deleted: 5 });
    expect(mockSql).toHaveBeenCalledWith(expect.any(Array), 5);
  });

  it("should return 401 when not authenticated", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(false);

    const request = new NextRequest(
      "http://localhost/api/comments/5",
      { method: "DELETE" }
    );
    const params = Promise.resolve({ id: "5" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    // Admin-only: unauthenticated requests get 401
    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 400 when ID is not a number", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const request = new NextRequest(
      "http://localhost/api/comments/abc",
      { method: "DELETE" }
    );
    const params = Promise.resolve({ id: "abc" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid comment ID.");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should return 400 when ID is negative", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const request = new NextRequest(
      "http://localhost/api/comments/-1",
      { method: "DELETE" }
    );
    const params = Promise.resolve({ id: "-1" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid comment ID.");
  });

  it("should return 400 when ID is zero", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    const request = new NextRequest(
      "http://localhost/api/comments/0",
      { method: "DELETE" }
    );
    const params = Promise.resolve({ id: "0" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid comment ID.");
  });

  it("should return 404 when comment does not exist", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    mockSql.mockResolvedValueOnce([]); // No rows deleted

    const request = new NextRequest(
      "http://localhost/api/comments/999",
      { method: "DELETE" }
    );
    const params = Promise.resolve({ id: "999" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Comment not found.");
  });

  it("should return 500 when database query fails", async () => {
    const { verifyApiAuth } = await import("@/lib/analytics-auth");
    vi.mocked(verifyApiAuth).mockReturnValue(true);

    mockSql.mockRejectedValueOnce(new Error("Database error"));

    const request = new NextRequest(
      "http://localhost/api/comments/5",
      { method: "DELETE" }
    );
    const params = Promise.resolve({ id: "5" });

    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to delete comment.");
  });
});
