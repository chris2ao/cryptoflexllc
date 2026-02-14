/**
 * Tests for DELETE /api/comments/[id]
 * -----------------------------------------------
 * Verifies authorization logic for comment deletion:
 * - Admin can delete any comment
 * - Subscriber can delete own comment
 * - Cannot delete others' comments
 * - Handles invalid/missing comment IDs
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

  describe("Input Validation", () => {
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

  describe("Admin Path", () => {
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

  describe("Subscriber Path", () => {
    beforeEach(() => {
      (verifyApiAuth as ReturnType<typeof vi.fn>).mockReturnValue(false);
    });

    it("should allow subscriber to delete own comment", async () => {
      // First query: fetch comment to verify ownership
      mockSql.mockResolvedValueOnce([
        { id: 42, email: "user@example.com" },
      ]);
      // Second query: delete comment
      mockSql.mockResolvedValueOnce([{ id: 42 }]);

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

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.deleted).toBe(42);

      // Verify ownership check query (first call)
      const selectCall = mockSql.mock.calls[0];
      expect(selectCall[0][0]).toContain("SELECT id, email FROM blog_comments WHERE id = ");
      expect(selectCall[1]).toBe(42);

      // Verify delete query (second call)
      const deleteCall = mockSql.mock.calls[1];
      expect(deleteCall[0][0]).toContain("DELETE FROM blog_comments WHERE id = ");
      expect(deleteCall[1]).toBe(42);
    });

    it("should handle case-insensitive email matching", async () => {
      mockSql.mockResolvedValueOnce([
        { id: 42, email: "User@Example.COM" },
      ]);
      mockSql.mockResolvedValueOnce([{ id: 42 }]);

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

      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
    });

    it("should return 403 when subscriber tries to delete another user's comment", async () => {
      mockSql.mockResolvedValueOnce([
        { id: 42, email: "owner@example.com" },
      ]);

      const request = new NextRequest("http://localhost/api/comments/42", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: "attacker@example.com" }),
      });
      const params = { id: "42" };

      const response = await DELETE(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Forbidden. You can only delete your own comments.");

      // Should not attempt deletion
      expect(mockSql).toHaveBeenCalledTimes(1);
    });

    it("should return 403 when no email provided", async () => {
      const request = new NextRequest("http://localhost/api/comments/42", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const params = { id: "42" };

      const response = await DELETE(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Unauthorized. Email required for subscriber deletion.");
    });

    it("should return 403 when request body is invalid JSON", async () => {
      const request = new NextRequest("http://localhost/api/comments/42", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: "invalid-json",
      });
      const params = { id: "42" };

      const response = await DELETE(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Unauthorized. Email required for subscriber deletion.");
    });

    it("should return 404 when subscriber tries to delete nonexistent comment", async () => {
      mockSql.mockResolvedValueOnce([]);

      const request = new NextRequest("http://localhost/api/comments/999", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: "user@example.com" }),
      });
      const params = { id: "999" };

      const response = await DELETE(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Comment not found.");
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      (verifyApiAuth as ReturnType<typeof vi.fn>).mockReturnValue(false);
    });

    it("should return 500 on database error during ownership check", async () => {
      mockSql.mockRejectedValue(new Error("Database connection failed"));

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

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to delete comment.");
    });

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
