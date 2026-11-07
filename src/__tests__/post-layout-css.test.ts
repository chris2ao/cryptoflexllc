import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
const HEADER =
  "/* ==== EDITORIAL REDESIGN: post layout breakout (CLAUD-765 item 9) ==== */";

describe("post layout breakout css", () => {
  const headerAt = css.indexOf(HEADER);
  const block = headerAt >= 0 ? css.slice(headerAt) : "";

  it("has the breakout block", () => {
    expect(headerAt).toBeGreaterThan(-1);
    expect(block).toContain("max-width: 1200px");
  });

  it("derives the column from the viewport, never from a container query", () => {
    expect(block).toContain("calc(min(100vw - 80px, 1200px) - 308px)");
    expect(block).not.toContain("container-type");
    expect(block).not.toContain("cqw");
  });

  it("keeps the scroll-shadow background on prose-table-wrap", () => {
    expect(css).toMatch(/\.prose-table-wrap\s*\{[^}]*background:/);
  });
});
