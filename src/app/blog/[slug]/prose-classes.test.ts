import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("blog post prose wrapper", () => {
  const source = readFileSync(join(__dirname, "page.tsx"), "utf8");
  const wrapper = source.match(/className="(prose dark:prose-invert[^"]*)"/)?.[1] ?? "";

  it("finds the prose wrapper", () => {
    expect(wrapper).not.toBe("");
  });

  it("suppresses Typography backticks around inline code", () => {
    expect(wrapper).toContain("prose-code:before:content-none");
    expect(wrapper).toContain("prose-code:after:content-none");
  });
});
