import { describe, it, expect } from "vitest";
import { classifyReferrer, referrerHost } from "./referrer";

describe("classifyReferrer", () => {
  it.each([
    ["", "", "direct"],
    ["javascript:void(0)", "", "direct"],
    ["about:blank", "", "direct"],
    ["x".repeat(2100), "", "direct"],
    ["https://www.google.com/search?q=x", "google.com", "search"],
    ["https://www.google.co.uk/", "google.co.uk", "search"],
    ["https://yandex.ru/", "yandex.ru", "search"],
    ["https://www.aocr.org/", "aocr.org", "forged"],
    ["https://www.cryptoflexllc.com/blog", "cryptoflexllc.com", "internal"],
    ["https://cryptoflexllc-abc-chris.vercel.app/", "cryptoflexllc-abc-chris.vercel.app", "internal"],
    ["http://localhost:3000/", "localhost", "internal"],
    ["https://news.ycombinator.com/item?id=1", "news.ycombinator.com", "social"],
    ["https://t.co/abc", "t.co", "social"],
    ["https://chatgpt.com/", "chatgpt.com", "ai"],
    ["https://gemini.google.com/app", "gemini.google.com", "ai"],
    ["https://google.attacker.com/", "google.attacker.com", "other"],
    ["https://google.com.evil.net/", "google.com.evil.net", "other"],
    ["https://docs.google.com/document/d/1", "docs.google.com", "other"],
    ["https://example.org/post", "example.org", "other"],
    ["https://evilcryptoflexllc.com/", "evilcryptoflexllc.com", "other"],
    ["https://notlocalhost/", "notlocalhost", "other"],
  ])("%s -> host %s, class %s", (ref, host, cls) => {
    const result = classifyReferrer(ref, {});
    expect(result.cls).toBe(cls);
    if (ref.length <= 2000) expect(result.host).toBe(host);
    else expect(result.host).toBe("");
  });

  it("classifies newsletter by utm", () => {
    expect(classifyReferrer("", { source: "newsletter", medium: "email" }).cls).toBe("newsletter");
  });
  it("utm email wins over a search referrer", () => {
    expect(classifyReferrer("https://www.google.com/", { medium: "email" }).cls).toBe("newsletter");
  });
  it("classifies an AI utm source", () => {
    expect(classifyReferrer("", { source: "chatgpt.com" }).cls).toBe("ai");
    expect(classifyReferrer("", { source: "chatgpt" }).cls).toBe("ai");
    expect(classifyReferrer("", { source: "perplexity" }).cls).toBe("ai");
  });
});

describe("referrerHost", () => {
  it("lowercases and strips www", () => {
    expect(referrerHost("HTTPS://WWW.Example.COM/x")).toBe("example.com");
  });
});
