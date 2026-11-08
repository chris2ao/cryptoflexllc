import { describe, it, expect } from "vitest";
import {
  BOT_UA_PATTERN_SOURCE,
  classifyAtInsert,
  classifyFromSignals,
  isBotUserAgent,
} from "./classify";

const CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0 Safari/537.36";
const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1";

describe("isBotUserAgent", () => {
  it.each([
    "Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)",
    "python-requests/2.31",
    "curl/8.4.0",
    "Mozilla/5.0 (Linux; Android 10) HeadlessChrome/120",
    "facebookexternalhit/1.1",
  ])("flags %s", (ua) => expect(isBotUserAgent(ua)).toBe(true));

  it.each([CHROME, IPHONE])("passes %s", (ua) => expect(isBotUserAgent(ua)).toBe(false));
});

describe("classifyAtInsert", () => {
  const base = { userAgent: CHROME, referrerClass: "search" as const, pagePath: "/blog/x" };
  it("forged referrer is bot", () =>
    expect(classifyAtInsert({ ...base, referrerClass: "forged" })).toBe("bot"));
  it("/analytics is self even with a search referrer", () =>
    expect(classifyAtInsert({ ...base, pagePath: "/analytics" })).toBe("self"));
  it("/backlog/x is self", () =>
    expect(classifyAtInsert({ ...base, pagePath: "/backlog/x" })).toBe("self"));
  it("crawler UA is bot", () =>
    expect(classifyAtInsert({ ...base, userAgent: "curl/8.4.0" })).toBe("bot"));
  it("normal visit is deferred", () => expect(classifyAtInsert(base)).toBeNull());
});

describe("classifyFromSignals", () => {
  const base = {
    userAgent: CHROME,
    referrerClass: "direct" as const,
    pagePath: "/blog/x",
    isHosting: null,
    hasEngagement: false,
    isOwnerIp: false,
  };
  it("owner IP beats crawler UA", () =>
    expect(classifyFromSignals({ ...base, userAgent: "curl/8.4.0", isOwnerIp: true })).toBe("owner"));
  it("hosting without engagement is bot", () =>
    expect(classifyFromSignals({ ...base, isHosting: true })).toBe("bot"));
  it("hosting with engagement is human", () =>
    expect(classifyFromSignals({ ...base, isHosting: true, hasEngagement: true })).toBe("human"));
  it("unknown hosting without engagement is human", () =>
    expect(classifyFromSignals(base)).toBe("human"));
  it("forged is bot", () =>
    expect(classifyFromSignals({ ...base, referrerClass: "forged" })).toBe("bot"));
  it("/analytics is self before anything else", () =>
    expect(
      classifyFromSignals({ ...base, pagePath: "/analytics", isOwnerIp: true, referrerClass: "forged" }),
    ).toBe("self"));
});

describe("BOT_UA_PATTERN_SOURCE Postgres parity", () => {
  it("compiles as a case-insensitive JS regex", () => {
    expect(() => new RegExp(BOT_UA_PATTERN_SOURCE, "i")).not.toThrow();
  });

  it.each(["\\b", "\\B", "(?<", "\\p{", "\\P{", "\\u", "\\k<", "(?i"])(
    "contains no %s construct",
    (construct) => expect(BOT_UA_PATTERN_SOURCE.includes(construct)).toBe(false),
  );

  it("keeps every alternative to plain literals (widen deliberately)", () => {
    for (const alt of BOT_UA_PATTERN_SOURCE.split("|")) {
      expect(alt).toMatch(/^[a-z0-9/-]+$/);
    }
  });
});
