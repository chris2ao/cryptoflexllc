import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

function block(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`missing rule ${selector}`);
  return css.slice(start, css.indexOf("}", start));
}

describe("single sticky header CSS", () => {
  it("masthead is 97% opaque", () => {
    expect(block(".masthead")).toContain("97%");
  });

  it("subnav is not sticky", () => {
    expect(block(".ed-subnav")).not.toContain("position: sticky");
    expect(css).not.toMatch(/\.ed-subnav \{\s*top:/);
  });

  it("scroll-margin-top matches the 72/88px masthead plus 12px", () => {
    expect(css).toContain("scroll-margin-top: 84px");
    expect(css).toContain("scroll-margin-top: 100px");
    for (const stale of ["128px", "144px", "136px"]) {
      expect(css).not.toContain(`scroll-margin-top: ${stale}`);
    }
  });

  it("post aside sticks at 100px", () => {
    const start = css.indexOf("@media (min-width: 1024px) {\n  .ed-post-aside {");
    expect(start).toBeGreaterThan(-1);
    expect(css.slice(start, css.indexOf("}", start))).toContain("top: 100px");
  });
});
