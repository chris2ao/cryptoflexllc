import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
const HEADER =
  "/* ==== EDITORIAL REDESIGN: post layout breakout (CLAUD-765 item 9) ==== */";

describe("post layout breakout css", () => {
  const headerAt = css.indexOf(HEADER);
  const block = headerAt >= 0 ? css.slice(headerAt) : "";

  it("appends the breakout block after the reduced-motion block", () => {
    const reducedAt = css.indexOf("@media (prefers-reduced-motion: reduce)");
    expect(reducedAt).toBeGreaterThan(-1);
    expect(headerAt).toBeGreaterThan(reducedAt);
  });

  it("uses a container query sized column for wide tables", () => {
    expect(block).toContain("container-type: inline-size");
    expect(block).toContain("100cqw");
    expect(block).toContain("308px");
  });

  it("keeps the scroll-shadow background on prose-table-wrap", () => {
    expect(css).toMatch(/\.prose-table-wrap\s*\{[^}]*background:/);
  });
});
