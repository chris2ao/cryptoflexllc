/**
 * Integration tests for GET /api/cron/weekly-digest
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "./route";
import { NextRequest } from "next/server";

vi.mock("@/lib/analytics");
vi.mock("@/lib/blog");
vi.mock("@/lib/subscribers");
vi.mock("@/lib/newsletter-intro");
vi.mock("nodemailer");
vi.mock("@/lib/email-retry", () => ({
  withRetry: vi.fn((fn: () => Promise<unknown>) => fn()),
}));

describe("GET /api/cron/weekly-digest", () => {
  let mockSql: any;
  let mockTransporter: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock getDb
    const { getDb } = await import("@/lib/analytics");
    mockSql = vi.fn();
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
        slug: "recent-post",
        title: "Recent Post",
        date: new Date().toISOString(),
        description: "A recent post",
        tags: ["test"],
        readingTime: "5 min",
        author: "",
        content: "",
      },
      {
        slug: "old-post",
        title: "Old Post",
        date: "2025-01-01",
        description: "An old post",
        tags: [],
        readingTime: "3 min",
        author: "",
        content: "",
      },
    ]);

    // Mock unsubscribeUrl
    const { unsubscribeUrl } = await import("@/lib/subscribers");
    vi.mocked(unsubscribeUrl).mockImplementation(
      (email) => `https://www.cryptoflexllc.com/api/unsubscribe?email=${email}&token=test`
    );

    // Mock generateDigestIntro
    const { generateDigestIntro } = await import("@/lib/newsletter-intro");
    vi.mocked(generateDigestIntro).mockResolvedValue({
      greeting: "AI-generated greeting for this week.",
      contentIntro: "AI-generated content intro about the posts.",
      memeHtml: '<div style="margin:16px 0">Meme of the Week</div>',
      fromAi: true,
    });

    // Set required env vars
    process.env.CRON_SECRET = "test-cron-secret";
    process.env.GMAIL_USER = "test@cryptoflexllc.com";
    process.env.GMAIL_APP_PASSWORD = "test-password";
    process.env.SUBSCRIBER_SECRET = "test-secret";
  });

  afterEach(() => {
    delete process.env.CRON_SECRET;
    delete process.env.GMAIL_USER;
    delete process.env.GMAIL_APP_PASSWORD;
    delete process.env.SUBSCRIBER_SECRET;
  });

  it("should send digest to all active subscribers with recent posts", async () => {
    // First SQL call: fetch subscribers
    mockSql.mockResolvedValueOnce([
      { email: "user1@example.com" },
      { email: "user2@example.com" },
    ]);
    // Subscriber verification: both active
    mockSql.mockResolvedValueOnce([{ id: 1 }]);
    mockSql.mockResolvedValueOnce([{ id: 2 }]);

    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer test-cron-secret",
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      ok: true,
      sent: 2,
      posts: 1, // Only 1 recent post from the last 7 days
      totalPosts: 1,
      aiIntro: true,
    });

    expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: '"CryptoFlex LLC" <test@cryptoflexllc.com>',
        to: "user1@example.com",
        subject: expect.stringContaining("New Post"),
        html: expect.stringContaining("Recent Post"),
      })
    );
  });

  it("should return 401 when authorization header is missing", async () => {
    const request = new NextRequest("http://localhost/api/cron/weekly-digest");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(mockSql).not.toHaveBeenCalled();
  });

  it("should return 401 when cron secret is incorrect", async () => {
    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer wrong-secret",
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should handle zero active subscribers", async () => {
    mockSql.mockResolvedValueOnce([]);

    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer test-cron-secret",
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      ok: true,
      sent: 0,
      reason: "no subscribers",
    });

    expect(mockTransporter.sendMail).not.toHaveBeenCalled();
  });

  it("should send 'no new posts' email when no recent posts", async () => {
    // Mock getAllPosts to return only old posts
    const { getAllPosts } = await import("@/lib/blog");
    vi.mocked(getAllPosts).mockReturnValue([
      {
        slug: "old-post",
        title: "Old Post",
        date: "2025-01-01",
        description: "An old post",
        tags: [],
        readingTime: "3 min",
        author: "",
        content: "",
      },
    ]);

    mockSql.mockResolvedValueOnce([{ email: "user@example.com" }]);
    mockSql.mockResolvedValueOnce([{ id: 1 }]); // verification

    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer test-cron-secret",
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      ok: true,
      sent: 1,
      posts: 0,
      totalPosts: 0,
      aiIntro: false,
    });

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("Quick Update"),
        html: expect.stringContaining("No new posts this week"),
      })
    );
  });

  it("should cap digest at 10 posts when more than 10 recent posts exist", async () => {
    // Generate 15 recent posts
    const { getAllPosts } = await import("@/lib/blog");
    const recentDate = new Date();
    const manyPosts = Array.from({ length: 15 }, (_, i) => ({
      slug: `post-${i + 1}`,
      title: `Post ${i + 1}`,
      date: recentDate.toISOString(),
      description: `Description for post ${i + 1}`,
      tags: ["test"],
      readingTime: "5 min",
      author: "",
      content: "",
    }));
    vi.mocked(getAllPosts).mockReturnValue(manyPosts);

    mockSql.mockResolvedValueOnce([{ email: "user@example.com" }]);
    mockSql.mockResolvedValueOnce([{ id: 1 }]); // verification

    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer test-cron-secret",
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toBe(10); // Capped at 10
    expect(data.totalPosts).toBe(15); // Total available

    // Subject should say 10 posts, not 15
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("10 New Posts"),
      })
    );

    // Email should contain overflow message
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining("Plus 5 more posts on the blog this week"),
      })
    );

    // Email should NOT contain post 11+
    const sentHtml = mockTransporter.sendMail.mock.calls[0][0].html;
    expect(sentHtml).toContain("Post 1");
    expect(sentHtml).toContain("Post 10");
    expect(sentHtml).not.toContain("Post 11");
  });

  it("should include unsubscribe link in email headers", async () => {
    mockSql.mockResolvedValueOnce([{ email: "user@example.com" }]);
    mockSql.mockResolvedValueOnce([{ id: 1 }]); // verification

    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer test-cron-secret",
      },
    });

    await GET(request);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          "List-Unsubscribe": expect.stringContaining("/api/unsubscribe"),
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        }),
      })
    );
  });

  it("should send personalized emails to each subscriber", async () => {
    mockSql.mockResolvedValueOnce([
      { email: "user1@example.com" },
      { email: "user2@example.com" },
      { email: "user3@example.com" },
    ]);
    // Subscriber verifications: all active
    mockSql.mockResolvedValueOnce([{ id: 1 }]);
    mockSql.mockResolvedValueOnce([{ id: 2 }]);
    mockSql.mockResolvedValueOnce([{ id: 3 }]);

    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer test-cron-secret",
      },
    });

    await GET(request);

    expect(mockTransporter.sendMail).toHaveBeenCalledTimes(3);

    // Verify each email was sent to correct recipient
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "user1@example.com" })
    );
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "user2@example.com" })
    );
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "user3@example.com" })
    );
  });

  it("should use plural 'Posts' in subject when multiple recent posts", async () => {
    // Mock getAllPosts to return multiple recent posts
    const { getAllPosts } = await import("@/lib/blog");
    const recentDate = new Date();
    vi.mocked(getAllPosts).mockReturnValue([
      {
        slug: "post1",
        title: "Post 1",
        date: recentDate.toISOString(),
        description: "Post 1",
        tags: [],
        readingTime: "5 min",
        author: "",
        content: "",
      },
      {
        slug: "post2",
        title: "Post 2",
        date: recentDate.toISOString(),
        description: "Post 2",
        tags: [],
        readingTime: "3 min",
        author: "",
        content: "",
      },
    ]);

    mockSql.mockResolvedValueOnce([{ email: "user@example.com" }]);
    mockSql.mockResolvedValueOnce([{ id: 1 }]); // verification

    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer test-cron-secret",
      },
    });

    await GET(request);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringMatching(/2 New Posts/),
      })
    );
  });

  it("should use singular 'Post' in subject when one recent post", async () => {
    mockSql.mockResolvedValueOnce([{ email: "user@example.com" }]);
    mockSql.mockResolvedValueOnce([{ id: 1 }]); // verification

    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer test-cron-secret",
      },
    });

    await GET(request);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringMatching(/1 New Post!/),
      })
    );
  });

  it("should return 500 when database query fails", async () => {
    mockSql.mockRejectedValueOnce(new Error("Database error"));

    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer test-cron-secret",
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to send weekly digest");
  });

  it("should continue gracefully when email sending fails for a subscriber", async () => {
    mockSql.mockResolvedValueOnce([{ email: "user@example.com" }]);
    mockSql.mockResolvedValueOnce([{ id: 1 }]); // verification
    mockTransporter.sendMail.mockRejectedValueOnce(
      new Error("SMTP connection failed")
    );

    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer test-cron-secret",
      },
    });

    const response = await GET(request);
    const data = await response.json();

    // Per-subscriber errors are caught, not propagated as 500
    expect(response.status).toBe(200);
    expect(data.sent).toBe(0); // Failed send doesn't increment count
  });

  it("should configure Gmail SMTP with correct settings", async () => {
    mockSql.mockResolvedValueOnce([{ email: "user@example.com" }]);
    mockSql.mockResolvedValueOnce([{ id: 1 }]); // verification

    const nodemailer = await import("nodemailer");
    const createTransportSpy = vi.mocked(nodemailer.default.createTransport);

    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer test-cron-secret",
      },
    });

    await GET(request);

    expect(createTransportSpy).toHaveBeenCalledWith({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "test@cryptoflexllc.com",
        pass: "test-password",
      },
    });
  });

  it("should include AI-generated intro in email HTML", async () => {
    mockSql.mockResolvedValueOnce([{ email: "user@example.com" }]);
    mockSql.mockResolvedValueOnce([{ id: 1 }]); // verification

    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer test-cron-secret",
      },
    });

    await GET(request);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining("AI-generated greeting for this week."),
      })
    );
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining("AI-generated content intro about the posts."),
      })
    );
  });

  it("should include aiIntro flag in response JSON", async () => {
    mockSql.mockResolvedValueOnce([{ email: "user@example.com" }]);
    mockSql.mockResolvedValueOnce([{ id: 1 }]); // verification

    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer test-cron-secret",
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(data.aiIntro).toBe(true);
  });

  it("should still send email when AI intro falls back to static text", async () => {
    const { generateDigestIntro } = await import("@/lib/newsletter-intro");
    vi.mocked(generateDigestIntro).mockResolvedValueOnce({
      greeting:
        "Thanks for being a subscriber &mdash; it means a lot! Every week I share what I&rsquo;ve been learning about cybersecurity, infrastructure, AI-assisted development, and the projects I&rsquo;m building.",
      contentIntro: "Here&rsquo;s what I learned and wrote about this week:",
      memeHtml: "",
      fromAi: false,
    });

    mockSql.mockResolvedValueOnce([{ email: "user@example.com" }]);
    mockSql.mockResolvedValueOnce([{ id: 1 }]); // verification

    const request = new NextRequest("http://localhost/api/cron/weekly-digest", {
      headers: {
        authorization: "Bearer test-cron-secret",
      },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.aiIntro).toBe(false);
    expect(data.sent).toBe(1);
    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining("Thanks for being a subscriber"),
      })
    );
  });
});
