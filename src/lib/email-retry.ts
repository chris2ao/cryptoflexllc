interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
}

interface SmtpError extends Error {
  responseCode?: number;
}

/**
 * Wraps an async function with retry logic using exponential backoff.
 *
 * Retries transient errors (network, timeout) but not authentication errors.
 * Backoff timing: 1s, 4s, 16s (baseDelay * 4^attempt)
 *
 * @param fn - The async function to retry
 * @param options - Retry configuration (maxRetries=3, baseDelay=1000ms)
 * @returns Promise resolving to the function's result
 * @throws The last error after all retries are exhausted
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const maxRetries = options?.maxRetries ?? 3;
  const baseDelay = options?.baseDelay ?? 1000;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on authentication errors (SMTP 535)
      const smtpError = error as SmtpError;
      if (smtpError.responseCode === 535) {
        throw error;
      }

      // If we've exhausted all retries, throw the error
      if (attempt === maxRetries) {
        throw error;
      }

      // Calculate exponential backoff delay: baseDelay * 4^attempt
      const delay = baseDelay * Math.pow(4, attempt);

      console.warn(
        `Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms. Error: ${(error as Error).message}`
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // This should never be reached due to the throw in the loop,
  // but TypeScript needs it for type safety
  throw lastError!;
}
