import { describe, it, expect, vi, afterEach } from "vitest";
import { parseFrontmatter } from "./frontmatter";

describe("parseFrontmatter (F-C1 RCE guard)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("parses a normal bare `---` YAML fence", () => {
    const { data, content } = parseFrontmatter(
      "---\ntitle: Hello\ntags: [a, b]\n---\n# Body\n"
    );
    expect(data.title).toBe("Hello");
    expect(data.tags).toEqual(["a", "b"]);
    expect(content.trim()).toBe("# Body");
  });

  it("handles content with no frontmatter", () => {
    const { data, content } = parseFrontmatter("# Just a heading\n");
    expect(data).toEqual({});
    expect(content).toContain("# Just a heading");
  });

  it("does NOT execute a `---js` frontmatter fence (the RCE payload)", () => {
    const spy = vi.fn();
    // If eval ran, this side effect would fire. It must not.
    (globalThis as unknown as { __rce_probe__?: () => void }).__rce_probe__ = spy;
    const malicious =
      "---js\nmodule.exports = (function(){ globalThis.__rce_probe__(); return { title: 'x' }; })()\n---\n# body\n";
    expect(() => parseFrontmatter(malicious)).toThrow(/F-C1|language/);
    expect(spy).not.toHaveBeenCalled();
    delete (globalThis as unknown as { __rce_probe__?: () => void }).__rce_probe__;
  });

  it("rejects other declared fence languages (js, javascript, toml)", () => {
    for (const lang of ["js", "javascript", "toml", "coffee"]) {
      expect(() => parseFrontmatter(`---${lang}\nx = 1\n---\nbody`)).toThrow();
    }
  });

  it("does not false-positive on a `----` horizontal rule at the top", () => {
    // Leading horizontal rule, not frontmatter — must parse without throwing.
    expect(() => parseFrontmatter("----\n\nsome text\n")).not.toThrow();
  });
});
