import { describe, it, expect } from "vitest";
import {
  parsePostDate,
  formatPostDate,
  formatPostDateShort,
} from "./post-date";

describe("post-date", () => {
  describe("datetime frontmatter (23 posts use this shape)", () => {
    // Regression: callers used to append a time unconditionally, producing
    // "2026-04-17T23:30:00T00:00:00" and rendering "Invalid Date" on the
    // featured cards and backlog cards.
    it("formats a datetime value instead of yielding Invalid Date", () => {
      expect(formatPostDate("2026-04-17T23:30:00")).toBe("April 17, 2026");
      expect(formatPostDateShort("2026-04-17T22:00:00")).toBe("Apr 17, 2026");
    });

    it("does not mangle the string it parses", () => {
      expect(Number.isNaN(parsePostDate("2026-04-17T23:30:00").getTime())).toBe(
        false
      );
    });

    it("keeps a late-evening time on its own calendar day", () => {
      expect(formatPostDate("2026-12-31T23:59:00")).toBe("December 31, 2026");
    });
  });

  describe("bare calendar date (most posts use this shape)", () => {
    // Regression: a bare date parses as UTC midnight, which renders as the
    // previous day in negative-offset timezones. The post dated 2026-08-01
    // was rendering as "Jul 31, 2026" in the hero.
    it("does not shift backwards a day", () => {
      expect(formatPostDate("2026-08-01")).toBe("August 1, 2026");
      expect(formatPostDateShort("2026-08-01")).toBe("Aug 1, 2026");
    });

    it("holds across a year boundary", () => {
      expect(formatPostDate("2026-01-01")).toBe("January 1, 2026");
    });
  });

  describe("malformed input", () => {
    it("returns the raw value rather than rendering Invalid Date", () => {
      expect(formatPostDate("not a date")).toBe("not a date");
      expect(formatPostDateShort("")).toBe("");
    });
  });
});
