import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../weekly-digest/route';

// Mock dependencies
const mockQuery = vi.fn();

vi.mock('@/lib/analytics', () => ({
  getDb: vi.fn(() => mockQuery),
}));

vi.mock('@/lib/blog', () => ({
  getAllPosts: vi.fn(() => []),
}));

vi.mock('@/lib/subscribers', () => ({
  unsubscribeUrl: vi.fn((email) => `https://example.com/unsubscribe?email=${email}`),
}));

vi.mock('@/lib/newsletter-intro', () => ({
  generateDigestIntro: vi.fn(),
}));

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id' }),
      close: vi.fn(),
    })),
  },
}));

vi.mock('@/lib/email-retry', () => ({
  withRetry: vi.fn((fn) => fn()),
}));

describe('Weekly Digest API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuery.mockClear();

    // Set required env vars
    process.env.GMAIL_USER = 'test@example.com';
    process.env.GMAIL_APP_PASSWORD = 'test-pass';
    process.env.CRON_SECRET = 'test-secret';
    process.env.SUBSCRIBER_SECRET = 'subscriber-secret';
    process.env.DATABASE_URL = 'postgresql://test';
  });

  it('sends only to active subscribers returned by the query', async () => {
    const nodemailer = await import('nodemailer');
    const sendMailMock = vi.fn().mockResolvedValue({ messageId: 'test-id' });
    (nodemailer.default.createTransport as any).mockReturnValue({
      sendMail: sendMailMock,
      close: vi.fn(),
    });

    const { getAllPosts } = await import('@/lib/blog');
    (getAllPosts as any).mockReturnValue([
      {
        slug: 'test-post',
        title: 'Test Post',
        description: 'Test description',
        date: new Date().toISOString(),
        tags: [],
        readingTime: '5 min',
      },
    ]);

    // Mock: query returns only active subscribers (filtering is done in SQL)
    mockQuery.mockResolvedValueOnce([
      { email: 'active1@example.com' },
      { email: 'active2@example.com' },
    ]);

    const request = new NextRequest('http://localhost/api/cron/weekly-digest', {
      headers: { Authorization: 'Bearer test-secret' },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);

    // Should send to all subscribers returned by query
    expect(sendMailMock).toHaveBeenCalledTimes(2);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'active1@example.com' })
    );
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'active2@example.com' })
    );
  });

  it('wraps sendMail with retry logic', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { withRetry } = await import('@/lib/email-retry');
    const withRetrySpy = withRetry as any;

    const nodemailer = await import('nodemailer');
    const sendMailMock = vi.fn().mockResolvedValue({ messageId: 'test-id' });
    (nodemailer.default.createTransport as any).mockReturnValue({
      sendMail: sendMailMock,
      close: vi.fn(),
    });

    const { getAllPosts } = await import('@/lib/blog');
    (getAllPosts as any).mockReturnValue([
      {
        slug: 'test-post',
        title: 'Test Post',
        description: 'Test description',
        date: new Date().toISOString(),
        tags: [],
        readingTime: '5 min',
      },
    ]);

    // Mock: getSubscribers
    mockQuery.mockResolvedValueOnce([{ email: 'test@example.com' }]);

    const request = new NextRequest('http://localhost/api/cron/weekly-digest', {
      headers: { Authorization: 'Bearer test-secret' },
    });

    await GET(request);

    // Verify withRetry was called
    expect(withRetrySpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('continues sending after one subscriber fails all retries', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock withRetry to pass through
    const { withRetry: originalWithRetry } = await import('@/lib/email-retry');
    vi.mocked(originalWithRetry).mockImplementation(async (fn) => {
      const result = await fn();
      return result;
    });

    const nodemailer = await import('nodemailer');
    const sendMailMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network timeout')) // Fail for first subscriber
      .mockResolvedValueOnce({ messageId: 'test-id-2' }); // Succeed for second

    (nodemailer.default.createTransport as any).mockReturnValue({
      sendMail: sendMailMock,
      close: vi.fn(),
    });

    const { getAllPosts } = await import('@/lib/blog');
    (getAllPosts as any).mockReturnValue([
      {
        slug: 'test-post',
        title: 'Test Post',
        description: 'Test description',
        date: new Date().toISOString(),
        tags: [],
        readingTime: '5 min',
      },
    ]);

    // Mock: getSubscribers (2 subscribers)
    mockQuery.mockResolvedValueOnce([
      { email: 'fail@example.com' },
      { email: 'success@example.com' },
    ]);

    const request = new NextRequest('http://localhost/api/cron/weekly-digest', {
      headers: { Authorization: 'Bearer test-secret' },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);

    // Should attempt to send to both subscribers
    expect(sendMailMock).toHaveBeenCalledTimes(2);

    // Should log error for first subscriber but continue (with masked email)
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('f***@example.com'),
      expect.any(Error)
    );

    errorSpy.mockRestore();
  });

  it('returns 401 if CRON_SECRET is missing', async () => {
    delete process.env.CRON_SECRET;

    const request = new NextRequest('http://localhost/api/cron/weekly-digest', {
      headers: { Authorization: 'Bearer test-secret' },
    });

    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it('returns 401 if Authorization header is missing', async () => {
    const request = new NextRequest('http://localhost/api/cron/weekly-digest');

    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it('returns 401 if Authorization token does not match CRON_SECRET', async () => {
    const request = new NextRequest('http://localhost/api/cron/weekly-digest', {
      headers: { Authorization: 'Bearer wrong-secret' },
    });

    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  it('returns 200 with empty posts if no recent posts exist', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getAllPosts } = await import('@/lib/blog');
    // Return posts but all older than 7 days
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 10);
    (getAllPosts as any).mockReturnValue([
      {
        slug: 'old-post',
        title: 'Old Post',
        description: 'Old description',
        date: oldDate.toISOString(),
        tags: [],
        readingTime: '5 min',
      },
    ]);

    // SQL call: fetch subscribers
    mockQuery.mockResolvedValueOnce([{ email: 'test@example.com' }]);

    const request = new NextRequest('http://localhost/api/cron/weekly-digest', {
      headers: { Authorization: 'Bearer test-secret' },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toBe(0); // No posts from last 7 days

    errorSpy.mockRestore();
  });
});
