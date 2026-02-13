import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  makeUnsubscribeToken,
  unsubscribeUrl,
  isValidEmail,
} from "./subscribers";

describe("subscribers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    process.env.SUBSCRIBER_SECRET = "test-secret-key-123";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("makeUnsubscribeToken", () => {
    it("generates a deterministic HMAC token for an email", () => {
      const email = "user@example.com";
      const token1 = makeUnsubscribeToken(email);
      const token2 = makeUnsubscribeToken(email);

      expect(token1).toBe(token2);
      expect(token1).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex is 64 chars
    });

    it("normalizes email to lowercase and trimmed", () => {
      const token1 = makeUnsubscribeToken("  User@Example.COM  ");
      const token2 = makeUnsubscribeToken("user@example.com");

      expect(token1).toBe(token2);
    });

    it("generates different tokens for different emails", () => {
      const token1 = makeUnsubscribeToken("alice@example.com");
      const token2 = makeUnsubscribeToken("bob@example.com");

      expect(token1).not.toBe(token2);
    });

    it("throws error if SUBSCRIBER_SECRET is not set", () => {
      delete process.env.SUBSCRIBER_SECRET;

      expect(() => makeUnsubscribeToken("user@example.com")).toThrow(
        "SUBSCRIBER_SECRET env var is not set"
      );
    });

    it("generates different tokens with different secrets", () => {
      const token1 = makeUnsubscribeToken("user@example.com");

      process.env.SUBSCRIBER_SECRET = "different-secret-456";
      const token2 = makeUnsubscribeToken("user@example.com");

      expect(token1).not.toBe(token2);
    });
  });

  describe("unsubscribeUrl", () => {
    it("builds a valid unsubscribe URL", () => {
      const email = "user@example.com";
      const url = unsubscribeUrl(email);

      expect(url).toMatch(/^https:\/\/cryptoflexllc\.com\/api\/unsubscribe\?/);
      expect(url).toContain(`email=${encodeURIComponent(email)}`);
      expect(url).toContain("&token=");
    });

    it("URL-encodes the email parameter", () => {
      const email = "user+tag@example.com";
      const url = unsubscribeUrl(email);

      expect(url).toContain(encodeURIComponent(email));
    });

    it("normalizes email before generating token", () => {
      const url1 = unsubscribeUrl("  User@Example.COM  ");
      const url2 = unsubscribeUrl("user@example.com");

      // Extract tokens from both URLs
      const token1 = url1.split("token=")[1];
      const token2 = url2.split("token=")[1];

      expect(token1).toBe(token2);
    });

    it("includes the correct token in the URL", () => {
      const email = "test@example.com";
      const expectedToken = makeUnsubscribeToken(email);
      const url = unsubscribeUrl(email);

      expect(url).toContain(`token=${expectedToken}`);
    });
  });

  describe("isValidEmail", () => {
    it("accepts valid email addresses", () => {
      expect(isValidEmail("user@example.com")).toBe(true);
      expect(isValidEmail("alice.bob@company.co.uk")).toBe(true);
      expect(isValidEmail("name+tag@domain.org")).toBe(true);
      expect(isValidEmail("123@456.com")).toBe(true);
    });

    it("rejects emails without @ symbol", () => {
      expect(isValidEmail("notanemail")).toBe(false);
      expect(isValidEmail("user.example.com")).toBe(false);
    });

    it("rejects emails without domain", () => {
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
    });

    it("rejects emails without TLD", () => {
      expect(isValidEmail("user@domain")).toBe(false);
    });

    it("rejects emails with whitespace", () => {
      expect(isValidEmail("user @example.com")).toBe(false);
      expect(isValidEmail("user@ example.com")).toBe(false);
      expect(isValidEmail(" user@example.com ")).toBe(false);
    });

    it("rejects empty string", () => {
      expect(isValidEmail("")).toBe(false);
    });

    it("rejects emails longer than 320 characters", () => {
      const longEmail = "a".repeat(310) + "@example.com";
      expect(isValidEmail(longEmail)).toBe(false);
    });

    it("accepts emails up to 320 characters", () => {
      const maxEmail = "a".repeat(307) + "@example.com"; // 307 + 13 = 320
      expect(isValidEmail(maxEmail)).toBe(true);
    });

    it("rejects multiple @ symbols", () => {
      expect(isValidEmail("user@@example.com")).toBe(false);
      expect(isValidEmail("user@domain@com")).toBe(false);
    });
  });
});
