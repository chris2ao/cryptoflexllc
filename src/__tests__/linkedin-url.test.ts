import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const CANONICAL = "linkedin.com/in/chris-johnson-secops/";
const SRC = join(__dirname, "..");

const TRAILING_PUNCTUATION = /[.,;:>\]]+$/;

export function findLinkedInUrls(text: string): string[] {
  return Array.from(text.matchAll(/linkedin\.com\/in\/[^\s"'`)]*/g), (m) =>
    m[0].replace(TRAILING_PUNCTUATION, "")
  );
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    if (name === "node_modules") return [];
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

describe("LinkedIn profile URL", () => {
  it("uses the canonical path everywhere under src/", () => {
    const offenders: string[] = [];
    let found = 0;
    for (const file of walk(SRC)) {
      if (file === __filename || !/\.(tsx?|mdx?|json)$/.test(file)) continue;
      const text = readFileSync(file, "utf8");
      for (const url of findLinkedInUrls(text)) {
        found += 1;
        if (url !== CANONICAL) offenders.push(`${file}: ${url}`);
      }
    }
    expect(found).toBeGreaterThan(0);
    expect(offenders).toEqual([]);
  });

  it("ignores trailing sentence punctuation after a URL", () => {
    const text = "see https://www.linkedin.com/in/chris-johnson-secops/.";
    expect(findLinkedInUrls(text)).toEqual([CANONICAL]);
  });
});
