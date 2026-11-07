import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, oklchToSrgb } from "./contrast";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

function blockText(start: string): string {
  const from = css.indexOf(`\n${start} {`);
  if (from < 0) throw new Error(`block ${start} not found`);
  const to = css.indexOf("\n}", from + 1);
  return css.slice(from, to);
}

function token(block: string, name: string) {
  const m = block.match(
    new RegExp(`${name}:\\s*oklch\\(\\s*([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)\\s*\\)`),
  );
  if (!m) throw new Error(`token ${name} not found`);
  return oklchToSrgb(Number(m[1]), Number(m[2]), Number(m[3]));
}

const themes = [
  { name: "dark", selector: ":root", scheme: "color-scheme: dark" },
  { name: "light", selector: ".light", scheme: "color-scheme: light" },
] as const;

describe("contrast maths", () => {
  it("maps oklch white and black", () => {
    const w = oklchToSrgb(1, 0, 0);
    [w.r, w.g, w.b].forEach((v) => expect(Math.abs(v - 255)).toBeLessThan(1));
    const k = oklchToSrgb(0, 0, 0);
    [k.r, k.g, k.b].forEach((v) => expect(v).toBeLessThan(1));
  });

  it("gives 21:1 for white on black", () => {
    expect(Math.abs(contrastRatio(oklchToSrgb(1, 0, 0), oklchToSrgb(0, 0, 0)) - 21)).toBeLessThan(0.05);
  });
});

describe.each(themes)("$name theme tokens", ({ selector, scheme }) => {
  const block = blockText(selector);
  const backgrounds = ["--background", "--surface-1", "--surface-2"];

  it.each(["--foreground-muted", "--foreground-secondary"])(
    "%s reaches 4.5:1 on every surface",
    (fg) => {
      for (const bg of backgrounds) {
        const ratio = contrastRatio(token(block, fg), token(block, bg));
        expect(ratio, `${fg} on ${bg}: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it("declares color-scheme", () => {
    expect(block).toContain(scheme);
  });
});

describe("globals.css text colours", () => {
  it("never uses --fg-4 as a text colour", () => {
    expect(css).not.toContain("color: var(--fg-4)");
  });
});
