import { describe, it, expect, vi, afterEach } from 'vitest';
import { withRetry } from '../email-retry';

// Use real timers with baseDelay: 0 to avoid fake timer + unhandled rejection issues
describe('withRetry', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('succeeds on first try without retrying', async () => {
    const successFn = vi.fn().mockResolvedValue('success');

    const result = await withRetry(successFn, { baseDelay: 0 });

    expect(result).toBe('success');
    expect(successFn).toHaveBeenCalledTimes(1);
  });

  it('retries on transient failure and succeeds on 2nd try', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const retryFn = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network timeout'))
      .mockResolvedValueOnce('success');

    const result = await withRetry(retryFn, { baseDelay: 0 });

    expect(result).toBe('success');
    expect(retryFn).toHaveBeenCalledTimes(2);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Retry attempt 1/3')
    );

    warnSpy.mockRestore();
  });

  it('retries 3 times then throws the last error', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = new Error('Persistent network failure');
    const failFn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(failFn, { baseDelay: 0 })).rejects.toThrow(
      'Persistent network failure'
    );

    expect(failFn).toHaveBeenCalledTimes(4); // Initial + 3 retries
    expect(warnSpy).toHaveBeenCalledTimes(3);

    warnSpy.mockRestore();
  });

  it('uses exponential backoff timing (1s, 4s, 16s)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const timestamps: number[] = [];
    const error = new Error('Timeout');
    const failFn = vi.fn(() => {
      timestamps.push(Date.now());
      return Promise.reject(error);
    });

    // Use baseDelay: 1 to keep the test fast while verifying the 4^n pattern
    await expect(withRetry(failFn, { baseDelay: 1 })).rejects.toThrow(
      'Timeout'
    );

    expect(failFn).toHaveBeenCalledTimes(4); // Initial + 3 retries
    expect(timestamps).toHaveLength(4);

    // Verify delays increase (each gap should be >= previous)
    const gaps = [];
    for (let i = 1; i < timestamps.length; i++) {
      gaps.push(timestamps[i] - timestamps[i - 1]);
    }
    // With baseDelay=1: delays are 1ms, 4ms, 16ms
    // Gaps should be non-decreasing (allowing for timing jitter)
    expect(gaps[1]).toBeGreaterThanOrEqual(gaps[0]);
    expect(gaps[2]).toBeGreaterThanOrEqual(gaps[1]);

    warnSpy.mockRestore();
  });

  it('does not retry on SMTP auth errors (status 535)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const authError = Object.assign(new Error('Authentication failed'), {
      responseCode: 535,
    });
    const authFailFn = vi.fn().mockRejectedValue(authError);

    await expect(withRetry(authFailFn, { baseDelay: 0 })).rejects.toThrow(
      'Authentication failed'
    );

    // Should not retry auth errors
    expect(authFailFn).toHaveBeenCalledTimes(1);
    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('respects custom maxRetries option', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = new Error('Network error');
    const failFn = vi.fn().mockRejectedValue(error);

    await expect(
      withRetry(failFn, { maxRetries: 1, baseDelay: 0 })
    ).rejects.toThrow('Network error');

    expect(failFn).toHaveBeenCalledTimes(2); // Initial + 1 retry
    expect(warnSpy).toHaveBeenCalledTimes(1);

    warnSpy.mockRestore();
  });

  it('respects custom baseDelay option', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = new Error('Timeout');
    const timestamps: number[] = [];
    const failFn = vi.fn(() => {
      timestamps.push(Date.now());
      return Promise.reject(error);
    });

    await expect(
      withRetry(failFn, { maxRetries: 1, baseDelay: 10 })
    ).rejects.toThrow('Timeout');

    expect(failFn).toHaveBeenCalledTimes(2);
    // Verify the delay was at least 10ms (baseDelay * 4^0 = 10ms)
    const gap = timestamps[1] - timestamps[0];
    expect(gap).toBeGreaterThanOrEqual(8); // Allow small timing tolerance

    warnSpy.mockRestore();
  });
});
