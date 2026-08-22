import { describe, it, expect } from "vitest";
import {
  containsForbidden,
  findForbiddenItemIndex,
  candidateSchema,
  candidatesBodySchema,
  attemptSchema,
  attemptsBodySchema,
  decisionBodySchema,
} from "./gmail-unsubscribe-schemas";

function validCandidate() {
  return {
    sender_email: "Deals@Example.com",
    sender_domain: "example.com",
    method: "rfc8058-post",
    trashed_count_14d: 3,
    first_seen: "2026-08-01T00:00:00Z",
    last_seen: "2026-08-15T12:30:00+00:00",
  };
}

function validAttempt() {
  return {
    sender_email: "deals@example.com",
    attempted_at: "2026-08-15T12:30:00Z",
    status_code: 200,
    succeeded: true,
  };
}

describe("containsForbidden", () => {
  it("flags a URL", () => {
    expect(containsForbidden("https://x")).toBe(true);
  });

  it("flags a mailto link regardless of case", () => {
    expect(containsForbidden("MAILTO:a")).toBe(true);
  });

  it("flags an HTML tag", () => {
    expect(containsForbidden("<b>")).toBe(true);
  });

  it("allows a plain email address", () => {
    expect(containsForbidden("deals@example.com")).toBe(false);
  });
});

describe("findForbiddenItemIndex", () => {
  it("finds the index of the offending item in a well-formed items array", () => {
    const rawText = JSON.stringify({
      items: [
        { sender_email: "a@example.com" },
        { sender_email: "b@example.com", sender_domain: "https://evil.example" },
      ],
    });

    expect(findForbiddenItemIndex(rawText)).toBe(1);
  });

  it("returns null when the JSON cannot be parsed", () => {
    expect(findForbiddenItemIndex("not json at all https://evil.example")).toBeNull();
  });

  it("returns null when the body has no items array", () => {
    expect(findForbiddenItemIndex(JSON.stringify({ note: "https://evil.example" }))).toBeNull();
  });

  it("returns null when no single item accounts for the match", () => {
    const rawText = JSON.stringify({ items: [{ a: 1 }], extra: "https://evil.example" });

    expect(findForbiddenItemIndex(rawText)).toBeNull();
  });
});

describe("candidateSchema", () => {
  it("accepts a valid item and lowercases the email", () => {
    const result = candidateSchema.safeParse(validCandidate());
    expect(result.success).toBe(true);
    expect(result.data?.sender_email).toBe("deals@example.com");
  });

  it("rejects a bad method", () => {
    const result = candidateSchema.safeParse({
      ...validCandidate(),
      method: "carrier-pigeon",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a negative trashed_count_14d", () => {
    const result = candidateSchema.safeParse({
      ...validCandidate(),
      trashed_count_14d: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid date", () => {
    const result = candidateSchema.safeParse({
      ...validCandidate(),
      first_seen: "not-a-date",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an email over 320 chars", () => {
    const longLocal = "a".repeat(315);
    const result = candidateSchema.safeParse({
      ...validCandidate(),
      sender_email: `${longLocal}@example.com`,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a sender_domain containing http", () => {
    const result = candidateSchema.safeParse({
      ...validCandidate(),
      sender_domain: "http://example.com",
    });
    expect(result.success).toBe(false);
  });
});

describe("candidatesBodySchema", () => {
  it("rejects zero items", () => {
    const result = candidatesBodySchema.safeParse({ items: [] });
    expect(result.success).toBe(false);
  });

  it("rejects 501 items", () => {
    const items = Array.from({ length: 501 }, () => validCandidate());
    const result = candidatesBodySchema.safeParse({ items });
    expect(result.success).toBe(false);
  });

  it("accepts 500 items", () => {
    const items = Array.from({ length: 500 }, () => validCandidate());
    const result = candidatesBodySchema.safeParse({ items });
    expect(result.success).toBe(true);
  });
});

describe("attemptSchema", () => {
  it("accepts a valid item", () => {
    const result = attemptSchema.safeParse(validAttempt());
    expect(result.success).toBe(true);
  });

  it("accepts a null status_code", () => {
    const result = attemptSchema.safeParse({
      ...validAttempt(),
      status_code: null,
    });
    expect(result.success).toBe(true);
  });
});

describe("attemptsBodySchema", () => {
  it("rejects 101 items", () => {
    const items = Array.from({ length: 101 }, () => validAttempt());
    const result = attemptsBodySchema.safeParse({ items });
    expect(result.success).toBe(false);
  });

  it("accepts 100 items", () => {
    const items = Array.from({ length: 100 }, () => validAttempt());
    const result = attemptsBodySchema.safeParse({ items });
    expect(result.success).toBe(true);
  });
});

describe("decisionBodySchema", () => {
  it("accepts a valid approve decision", () => {
    const result = decisionBodySchema.safeParse({
      sender_email: "deals@example.com",
      decision: "approve",
      note: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a decision other than approve/deny", () => {
    const result = decisionBodySchema.safeParse({
      sender_email: "deals@example.com",
      decision: "ignore",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a note over 280 chars", () => {
    const result = decisionBodySchema.safeParse({
      sender_email: "deals@example.com",
      decision: "deny",
      note: "a".repeat(281),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a note containing http", () => {
    const result = decisionBodySchema.safeParse({
      sender_email: "deals@example.com",
      decision: "deny",
      note: "see http://example.com",
    });
    expect(result.success).toBe(false);
  });
});
