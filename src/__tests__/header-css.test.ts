import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

/** A rule block by selector, from the selector up to its first closing brace. */
function block(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`missing rule ${selector}`);
  return css.slice(start, css.indexOf("}", start));
}

/** Block from `marker` through the end of its `@media (min-width: 769px)` rule. */
function scrollMarginBlock(): string {
  const start = css.indexOf("Sticky masthead height plus 12px clearance");
  if (start < 0) throw new Error("missing scroll-margin comment");
  const media = css.indexOf("@media (min-width: 769px)", start);
  if (media < 0) throw new Error("missing 769px media rule");
  const end = css.indexOf("\n}\n", media);
  if (end < 0) throw new Error("unterminated media rule");
  return css.slice(start, end + 3);
}

describe("single sticky header CSS", () => {
  it("masthead is 97% opaque", () => {
    expect(block(".masthead")).toContain("97%");
  });

  it("subnav is not sticky", () => {
    const subnav = block(".ed-subnav");
    expect(subnav).not.toContain("position: sticky");
    expect(subnav).not.toMatch(/(^|[\s;{])top:/);
  });

  it("scroll-margin-top is 84px base and 100px above 768px, nothing else", () => {
    const scoped = scrollMarginBlock();
    const values = [...scoped.matchAll(/scroll-margin-top:\s*([^;]+);/g)].map(
      (m) => m[1].trim()
    );
    expect(values).toEqual(["84px", "100px"]);
    const media = scoped.slice(scoped.indexOf("@media (min-width: 769px)"));
    expect(media).toContain("scroll-margin-top: 100px");
    expect(media).not.toContain("84px");
  });

  it("post aside sticks at 100px", () => {
    const start = css.indexOf("@media (min-width: 1024px) {\n  .ed-post-aside {");
    expect(start).toBeGreaterThan(-1);
    expect(css.slice(start, css.indexOf("}", start))).toContain("top: 100px");
  });
});
