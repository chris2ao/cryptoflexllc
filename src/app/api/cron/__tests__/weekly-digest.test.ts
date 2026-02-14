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

  it('skips deleted or inactive subscribers', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const nodemailer = await import('nodemailer');
    const sendMailMock = vi.fn().mockResolvedValue({ messageId: 'test-id' });
    (nodemailer.default.createTransport as any).mockReturnValue({
      sendMail: sendMailMock,
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

    // Mock: getSubscribers query returns 3 subscribers
    mockQuery.mockResolvedValueOnce([
      { email: 'active@example.com' },
      { email: 'deleted@example.com' },
      { email: 'inactive@example.com' },
    ]);

    // Mock: subscriber verification queries
    // active@example.com exists and is active
    mockQuery.mockResolvedValueOnce([{ id: 1 }]);

    // deleted@example.com doesn't exist
    mockQuery.mockResolvedValueOnce([]);

    // inactive@example.com exists but is inactive (empty result)
    mockQuery.mockResolvedValueOnce([]);

    const request = new NextRequest('http://localhost/api/cron/weekly-digest', {
      headers: { Authorization: 'Bearer test-secret' },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);

    // Should only send to active@example.com (1 email)
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'active@example.com',
      })
    );

    // Should warn about skipped subscribers (with masked emails)
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('d***@example.com')
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('i***@example.com')
    );

    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('wraps sendMail with retry logic', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { withRetry } = await import('@/lib/email-retry');
    const withRetrySpy = withRetry as any;

    const nodemailer = await import('nodemailer');
    const sendMailMock = vi.fn().mockResolvedValue({ messageId: 'test-id' });
    (nodemailer.default.createTransport as any).mockReturnValue({
      sendMail: sendMailMock,
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

    // Mock: subscriber verification (active)
    mockQuery.mockResolvedValueOnce([{ id: 1 }]);

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
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Mock withRetry to actually retry but fail for first subscriber
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

    // Mock: subscriber verifications (both active)
    mockQuery.mockResolvedValueOnce([{ id: 1 }]);
    mockQuery.mockResolvedValueOnce([{ id: 2 }]);

    const request = new NextRequest('http://localhost/api/cron/weekly-digest', {
      headers: { Authorization: 'Bearer test-secret' },
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);

    // Should attempt to send to both subscribers
    expect(sendMailMock).toHaveBeenCalledTimes(2);

    // Should log error for first subscriber but continue (with masked email)
    // console.error is called with (message, error) so check first arg
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('f***@example.com'),
      expect.any(Error)
    );

    errorSpy.mockRestore();
    warnSpy.mockRestore();
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

    // First SQL call: fetch subscribers
    mockQuery.mockResolvedValueOnce([{ email: 'test@example.com' }]);
    // Subscriber verification: active
    mockQuery.mockResolvedValueOnce([{ id: 1 }]);

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
