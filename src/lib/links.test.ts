import { describe, it, expect } from "vitest";
import { isExternalHref } from "./links";

describe("isExternalHref", () => {
  it("treats absolute http and https URLs as external", () => {
    expect(isExternalHref("https://github.com/chris2ao/claude-code-config")).toBe(true);
    expect(isExternalHref("http://example.com")).toBe(true);
    expect(isExternalHref("HTTPS://EXAMPLE.COM")).toBe(true);
  });

  it("treats site paths and anchors as internal", () => {
    expect(isExternalHref("/blog/series/Ledgerly")).toBe(false);
    expect(isExternalHref("#subscribe")).toBe(false);
  });

  it("does not mistake look-alikes for external URLs", () => {
    expect(isExternalHref("//evil.example")).toBe(false);
    expect(isExternalHref("/http-guide")).toBe(false);
    expect(isExternalHref("httpx://nope")).toBe(false);
  });
});
