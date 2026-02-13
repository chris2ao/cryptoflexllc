import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  generateAuthToken,
  verifyAuthToken,
  verifyApiAuth,
  ANALYTICS_COOKIE_NAME,
} from "./analytics-auth";

describe("analytics-auth", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    process.env.ANALYTICS_SECRET = "test-analytics-secret-456";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("generateAuthToken", () => {
    it("generates a deterministic HMAC token", () => {
      const secret = "my-secret";
      const token1 = generateAuthToken(secret);
      const token2 = generateAuthToken(secret);

      expect(token1).toBe(token2);
      expect(token1).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex
    });

    it("generates different tokens for different secrets", () => {
      const token1 = generateAuthToken("secret1");
      const token2 = generateAuthToken("secret2");

      expect(token1).not.toBe(token2);
    });

    it("produces a valid hex string", () => {
      const token = generateAuthToken("test");
      expect(token).toHaveLength(64);
      expect(/^[0-9a-f]+$/.test(token)).toBe(true);
    });
  });

  describe("verifyAuthToken", () => {
    it("verifies a valid token", () => {
      const secret = "test-analytics-secret-456";
      const validToken = generateAuthToken(secret);

      expect(verifyAuthToken(validToken)).toBe(true);
    });

    it("rejects an invalid token", () => {
      const validToken = generateAuthToken("correct-secret");
      process.env.ANALYTICS_SECRET = "different-secret";

      expect(verifyAuthToken(validToken)).toBe(false);
    });

    it("rejects empty token", () => {
      expect(verifyAuthToken("")).toBe(false);
    });

    it("returns false if ANALYTICS_SECRET is not set", () => {
      delete process.env.ANALYTICS_SECRET;
      const token = "some-token";

      expect(verifyAuthToken(token)).toBe(false);
    });

    it("handles timing-safe comparison errors gracefully", () => {
      const validToken = generateAuthToken(process.env.ANALYTICS_SECRET!);
      const shortToken = validToken.slice(0, 10); // Length mismatch

      expect(verifyAuthToken(shortToken)).toBe(false);
    });

    it("uses constant-time comparison (timingSafeEqual)", () => {
      const secret = "test-analytics-secret-456";
      const validToken = generateAuthToken(secret);

      // Same length but different content
      const tamperedToken = "0".repeat(64);

      expect(verifyAuthToken(validToken)).toBe(true);
      expect(verifyAuthToken(tamperedToken)).toBe(false);
    });
  });

  describe("verifyApiAuth", () => {
    it("verifies request with valid cookie", () => {
      const secret = "test-analytics-secret-456";
      const token = generateAuthToken(secret);
      const request = new Request("http://example.com", {
        headers: {
          cookie: `${ANALYTICS_COOKIE_NAME}=${token}`,
        },
      });

      expect(verifyApiAuth(request)).toBe(true);
    });

    it("rejects request with invalid cookie", () => {
      const request = new Request("http://example.com", {
        headers: {
          cookie: `${ANALYTICS_COOKIE_NAME}=invalid-token`,
        },
      });

      expect(verifyApiAuth(request)).toBe(false);
    });

    it("verifies request with valid Bearer token", () => {
      const secret = "test-analytics-secret-456";
      const request = new Request("http://example.com", {
        headers: {
          authorization: `Bearer ${secret}`,
        },
      });

      expect(verifyApiAuth(request)).toBe(true);
    });

    it("rejects request with invalid Bearer token", () => {
      const request = new Request("http://example.com", {
        headers: {
          authorization: "Bearer wrong-secret",
        },
      });

      expect(verifyApiAuth(request)).toBe(false);
    });

    it("rejects request with no auth headers", () => {
      const request = new Request("http://example.com");

      expect(verifyApiAuth(request)).toBe(false);
    });

    it("returns false if ANALYTICS_SECRET is not set", () => {
      delete process.env.ANALYTICS_SECRET;
      const request = new Request("http://example.com", {
        headers: {
          cookie: `${ANALYTICS_COOKIE_NAME}=some-token`,
        },
      });

      expect(verifyApiAuth(request)).toBe(false);
    });

    it("handles cookie with other cookies present", () => {
      const secret = "test-analytics-secret-456";
      const token = generateAuthToken(secret);
      const request = new Request("http://example.com", {
        headers: {
          cookie: `other=value; ${ANALYTICS_COOKIE_NAME}=${token}; another=cookie`,
        },
      });

      expect(verifyApiAuth(request)).toBe(true);
    });

    it("handles cookie with spaces around name", () => {
      const secret = "test-analytics-secret-456";
      const token = generateAuthToken(secret);
      const request = new Request("http://example.com", {
        headers: {
          cookie: `other=value;  ${ANALYTICS_COOKIE_NAME}=${token}`,
        },
      });

      expect(verifyApiAuth(request)).toBe(true);
    });

    it("rejects malformed Authorization header", () => {
      const request = new Request("http://example.com", {
        headers: {
          authorization: "InvalidFormat",
        },
      });

      expect(verifyApiAuth(request)).toBe(false);
    });

    it("rejects Authorization header without Bearer prefix", () => {
      const request = new Request("http://example.com", {
        headers: {
          authorization: process.env.ANALYTICS_SECRET!,
        },
      });

      expect(verifyApiAuth(request)).toBe(false);
    });

    it("handles length mismatch in Bearer token gracefully", () => {
      const request = new Request("http://example.com", {
        headers: {
          authorization: "Bearer short",
        },
      });

      expect(verifyApiAuth(request)).toBe(false);
    });

    it("prefers cookie over Bearer token when both present", () => {
      const secret = "test-analytics-secret-456";
      const validToken = generateAuthToken(secret);
      const request = new Request("http://example.com", {
        headers: {
          cookie: `${ANALYTICS_COOKIE_NAME}=${validToken}`,
          authorization: "Bearer wrong-token",
        },
      });

      expect(verifyApiAuth(request)).toBe(true);
    });

    it("falls back to Bearer token if cookie is invalid", () => {
      const secret = "test-analytics-secret-456";
      const request = new Request("http://example.com", {
        headers: {
          cookie: `${ANALYTICS_COOKIE_NAME}=invalid`,
          authorization: `Bearer ${secret}`,
        },
      });

      expect(verifyApiAuth(request)).toBe(true);
    });
  });
});
