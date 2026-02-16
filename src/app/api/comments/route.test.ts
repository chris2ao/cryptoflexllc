/**
 * Integration tests for /api/comments (GET and POST)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");
vi.mock("@/lib/rate-limit", () => ({
  createRateLimiter: () => ({
    checkRateLimit: () => ({ allowed: true, remaining: 10 }),
  }),
  getClientIp: () => "127.0.0.1",
}));

describe("GET /api/comments", () => {
  let mockSql: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const { getDb } = await import("@/lib/analytics");
    mockSql = vi.fn();
    vi.mocked(getDb).mockReturnValue(mockSql);
  });

  it("should fetch comments and group into threaded structure", async () => {
    mockSql
      .mockResolvedValueOnce([
        {
          id: 1,
          slug: "test-post",
          comment: "Great post!",
          reaction: "up",
          email: "u***@example.com",
          created_at: "2026-02-13T11:00:00Z",
          parent_id: null,
        },
        {
          id: 2,
          slug: "test-post",
          comment: "Thanks for sharing",
          reaction: "down",
          email: "o***@example.com",
          created_at: "2026-02-13T12:00:00Z",
          parent_id: null,
        },
        {
          id: 3,
          slug: "test-post",
          comment: "I agree!",
          reaction: "up",
          email: "r***@example.com",
          created_at: "2026-02-13T13:00:00Z",
          parent_id: 1,
        },
      ])
      .mockResolvedValueOnce([{ thumbs_up: 1 }]);

    const request = new NextRequest(
      "http://localhost/api/comments?slug=test-post"
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    // Top-level comments should be in reverse order (newest first)
    expect(data.comments).toHaveLength(2);
    expect(data.comments[0].id).toBe(2); // newest top-level first
    expect(data.comments[0].replies).toEqual([]);
    expect(data.comments[1].id).toBe(1);
    expect(data.comments[1].replies).toHaveLength(1);
    expect(data.comments[1].replies[0].id).toBe(3);
    expect(data.thumbsUp).toBe(1);

    expect(mockSql).toHaveBeenCalledTimes(2);
  });

  it("should return empty array when no comments exist", async () => {
    mockSql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ thumbs_up: 0 }]);

    const request = new NextRequest(
      "http://localhost/api/comments?slug=empty-post"
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      comments: [],
      thumbsUp: 0,
    });
  });

  it("should handle missing thumbs_up count gracefully", async () => {
    mockSql.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    const request = new NextRequest(
      "http://localhost/api/comments?slug=test-post"
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.thumbsUp).toBe(0);
  });

  it("should return 400 when slug parameter is missing", async () => {
    const request = new NextRequest("http://localhost/api/comments");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Missing slug parameter.");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should return 400 when slug parameter is empty", async () => {
    const request = new NextRequest("http://localhost/api/comments?slug=");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Missing slug parameter.");
  });

  it("should return 500 when database query fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("Database error"));

    const request = new NextRequest(
      "http://localhost/api/comments?slug=test-post"
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to load comments.");
  });
});

describe("POST /api/comments", () => {
  let mockSql: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const { getDb } = await import("@/lib/analytics");
    mockSql = vi.fn();
    vi.mocked(getDb).mockReturnValue(mockSql);
  });

  it("should create a comment for a valid subscriber", async () => {
    // Mock subscriber check - user is subscribed
    mockSql.mockResolvedValueOnce([{ id: 1 }]);

    // Mock comment insertion
    mockSql.mockResolvedValueOnce([
      {
        id: 123,
        slug: "test-post",
        comment: "Great article!",
        reaction: "up",
        email: "subscriber@example.com",
        created_at: "2026-02-13T12:00:00Z",
        parent_id: null,
      },
    ]);

    const request = new NextRequest("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify({
        slug: "test-post",
        comment: "Great article!",
        reaction: "up",
        email: "subscriber@example.com",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      ok: true,
      comment: {
        id: 123,
        slug: "test-post",
        comment: "Great article!",
        reaction: "up",
        email: "subscriber@example.com",
        created_at: "2026-02-13T12:00:00Z",
        parent_id: null,
      },
    });

    expect(mockSql).toHaveBeenCalledTimes(2);
  });

  it("should create a reply to a top-level comment", async () => {
    // Mock subscriber check
    mockSql.mockResolvedValueOnce([{ id: 1 }]);

    // Mock parent comment check (top-level, parent_id is null)
    mockSql.mockResolvedValueOnce([{ id: 10, parent_id: null }]);

    // Mock reply insertion
    mockSql.mockResolvedValueOnce([
      {
        id: 200,
        slug: "test-post",
        comment: "I agree!",
        reaction: "up",
        email: "r***@example.com",
        created_at: "2026-02-13T14:00:00Z",
        parent_id: 10,
      },
    ]);

    const request = new NextRequest("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify({
        slug: "test-post",
        comment: "I agree!",
        reaction: "up",
        email: "replier@example.com",
        parent_id: 10,
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.comment.parent_id).toBe(10);
    expect(mockSql).toHaveBeenCalledTimes(3); // subscriber + parent check + insert
  });

  it("should return 404 when replying to a non-existent comment", async () => {
    // Mock subscriber check
    mockSql.mockResolvedValueOnce([{ id: 1 }]);

    // Mock parent comment check (not found)
    mockSql.mockResolvedValueOnce([]);

    const request = new NextRequest("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify({
        slug: "test-post",
        comment: "Reply to nothing",
        email: "user@example.com",
        parent_id: 999,
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("The comment you are replying to does not exist.");
  });

  it("should return 400 when replying to a reply (enforce single-level)", async () => {
    // Mock subscriber check
    mockSql.mockResolvedValueOnce([{ id: 1 }]);

    // Mock parent comment check (is itself a reply)
    mockSql.mockResolvedValueOnce([{ id: 50, parent_id: 10 }]);

    const request = new NextRequest("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify({
        slug: "test-post",
        comment: "Reply to a reply",
        email: "user@example.com",
        parent_id: 50,
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("You can only reply to top-level comments.");
  });

  it("should normalize email to lowercase and trim whitespace", async () => {
    mockSql.mockResolvedValueOnce([{ id: 1 }]);
    mockSql.mockResolvedValueOnce([
      {
        id: 1,
        slug: "test-post",
        comment: "Test",
        reaction: "up",
        email: "user@example.com",
        created_at: "2026-02-13T12:00:00Z",
        parent_id: null,
      },
    ]);

    const request = new NextRequest("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify({
        slug: "test-post",
        comment: "Test",
        email: "USER@EXAMPLE.COM",
      }),
      headers: { "content-type": "application/json" },
    });

    await POST(request);

    // First call checks subscriber with normalized email
    const subscriberCheckCall = mockSql.mock.calls[0];
    expect(subscriberCheckCall[1]).toBe("user@example.com");
  });

  it("should default reaction to 'up' when not provided", async () => {
    mockSql.mockResolvedValueOnce([{ id: 1 }]);
    mockSql.mockResolvedValueOnce([
      {
        id: 1,
        slug: "test-post",
        comment: "Test",
        reaction: "up",
        email: "user@example.com",
        created_at: "2026-02-13T12:00:00Z",
        parent_id: null,
      },
    ]);

    const request = new NextRequest("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify({
        slug: "test-post",
        comment: "Test",
        email: "user@example.com",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  it("should return 403 when email is not a subscriber", async () => {
    mockSql.mockResolvedValueOnce([]); // No subscriber found

    const request = new NextRequest("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify({
        slug: "test-post",
        comment: "Great article!",
        email: "nonsubscriber@example.com",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe(
      "You must be a subscriber to comment. Subscribe above and try again!"
    );

    // Should only call SQL once to check subscriber, not insert comment
    expect(mockSql).toHaveBeenCalledTimes(1);
  });

  it("should return 400 when slug is missing", async () => {
    const request = new NextRequest("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify({
        comment: "Test comment",
        email: "user@example.com",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });

  it("should return 400 when comment is too short", async () => {
    const request = new NextRequest("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify({
        slug: "test-post",
        comment: "X",
        email: "user@example.com",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });

  it("should return 400 when comment is too long", async () => {
    const request = new NextRequest("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify({
        slug: "test-post",
        comment: "X".repeat(2001),
        email: "user@example.com",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });

  it("should return 400 when reaction is invalid", async () => {
    const request = new NextRequest("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify({
        slug: "test-post",
        comment: "Test comment",
        reaction: "invalid",
        email: "user@example.com",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });

  it("should return 400 when email is invalid", async () => {
    const request = new NextRequest("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify({
        slug: "test-post",
        comment: "Test comment",
        email: "not-an-email",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });

  it("should return 400 when parent_id is not a positive integer", async () => {
    const request = new NextRequest("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify({
        slug: "test-post",
        comment: "Test comment",
        email: "user@example.com",
        parent_id: -1,
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid input");
  });

  it("should return 500 when database query fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("Database error"));

    const request = new NextRequest("http://localhost/api/comments", {
      method: "POST",
      body: JSON.stringify({
        slug: "test-post",
        comment: "Test comment",
        email: "user@example.com",
      }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Something went wrong. Please try again.");
  });

  it("should handle malformed JSON body", async () => {
    const request = new NextRequest("http://localhost/api/comments", {
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
