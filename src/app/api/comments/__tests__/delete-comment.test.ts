/**
 * Tests for DELETE /api/comments/[id]
 * -----------------------------------------------
 * Verifies authorization logic for comment deletion:
 * - Admin-only: requires analytics auth
 * - Handles invalid/missing comment IDs
 * - Returns proper errors for unauthenticated requests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { DELETE } from "../[id]/route";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/analytics", () => ({
  getDb: vi.fn(),
}));

vi.mock("@/lib/analytics-auth", () => ({
  verifyApiAuth: vi.fn(),
}));

import { getDb } from "@/lib/analytics";
import { verifyApiAuth } from "@/lib/analytics-auth";

describe("DELETE /api/comments/[id]", () => {
  let mockSql: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSql = vi.fn();
    (getDb as ReturnType<typeof vi.fn>).mockReturnValue(mockSql);
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      (verifyApiAuth as ReturnType<typeof vi.fn>).mockReturnValue(false);

      const request = new NextRequest("http://localhost/api/comments/42", {
        method: "DELETE",
      });
      const params = { id: "42" };

      const response = await DELETE(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 401 before checking ID validity", async () => {
      (verifyApiAuth as ReturnType<typeof vi.fn>).mockReturnValue(false);

      const request = new NextRequest("http://localhost/api/comments/abc", {
        method: "DELETE",
      });
      const params = { id: "abc" };

      const response = await DELETE(request, { params: Promise.resolve(params) });
      const data = await response.json();

      // Auth check happens before ID validation
      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
      expect(mockSql).not.toHaveBeenCalled();
    });

    it("should return 401 when subscriber provides email (no self-deletion)", async () => {
      (verifyApiAuth as ReturnType<typeof vi.fn>).mockReturnValue(false);

      const request = new NextRequest("http://localhost/api/comments/42", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: "user@example.com" }),
      });
      const params = { id: "42" };

      const response = await DELETE(request, { params: Promise.resolve(params) });
      const data = await response.json();

      // Subscriber self-deletion was removed; admin auth required
      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
      expect(mockSql).not.toHaveBeenCalled();
    });
  });

  describe("Input Validation", () => {
    beforeEach(() => {
      (verifyApiAuth as ReturnType<typeof vi.fn>).mockReturnValue(true);
    });

    it("should return 400 for invalid comment ID (NaN)", async () => {
      const request = new NextRequest("http://localhost/api/comments/abc", {
        method: "DELETE",
      });
      const params = { id: "abc" };

      const response = await DELETE(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid comment ID.");
    });

    it("should return 400 for invalid comment ID (zero)", async () => {
      const request = new NextRequest("http://localhost/api/comments/0", {
        method: "DELETE",
      });
      const params = { id: "0" };

      const response = await DELETE(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid comment ID.");
    });

    it("should return 400 for invalid comment ID (negative)", async () => {
      const request = new NextRequest("http://localhost/api/comments/-5", {
        method: "DELETE",
      });
      const params = { id: "-5" };

      const response = await DELETE(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid comment ID.");
    });
  });

  describe("Admin Deletion", () => {
    beforeEach(() => {
      (verifyApiAuth as ReturnType<typeof vi.fn>).mockReturnValue(true);
    });

    it("should allow admin to delete any comment", async () => {
      mockSql.mockResolvedValue([{ id: 123 }]);

      const request = new NextRequest("http://localhost/api/comments/123", {
        method: "DELETE",
        headers: {
          cookie: "analytics_session=valid-admin-token",
        },
      });
      const params = { id: "123" };

      const response = await DELETE(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.deleted).toBe(123);
      expect(verifyApiAuth).toHaveBeenCalledWith(request);

      // Verify DELETE query was called with correct ID
      const deleteCall = mockSql.mock.calls[0];
      expect(deleteCall[0][0]).toContain("DELETE FROM blog_comments WHERE id = ");
      expect(deleteCall[0][1]).toContain("RETURNING id");
      expect(deleteCall[1]).toBe(123);
    });

    it("should return 404 when admin tries to delete nonexistent comment", async () => {
      mockSql.mockResolvedValue([]);

      const request = new NextRequest("http://localhost/api/comments/999", {
        method: "DELETE",
        headers: {
          cookie: "analytics_session=valid-admin-token",
        },
      });
      const params = { id: "999" };

      const response = await DELETE(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Comment not found.");
    });
  });

  describe("Error Handling", () => {
    it("should return 500 on database error during admin deletion", async () => {
      (verifyApiAuth as ReturnType<typeof vi.fn>).mockReturnValue(true);
      mockSql.mockRejectedValue(new Error("Database connection failed"));

      const request = new NextRequest("http://localhost/api/comments/42", {
        method: "DELETE",
        headers: {
          cookie: "analytics_session=valid-admin-token",
        },
      });
      const params = { id: "42" };

      const response = await DELETE(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to delete comment.");
    });
  });
});
