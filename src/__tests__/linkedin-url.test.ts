import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const CANONICAL = "linkedin.com/in/chris-johnson-secops/";
const SRC = join(__dirname, "..");

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
      for (const m of text.matchAll(/linkedin\.com\/in\/[^\s"'`)]*/g)) {
        found += 1;
        if (m[0] !== CANONICAL) offenders.push(`${file}: ${m[0]}`);
      }
    }
    expect(found).toBeGreaterThan(0);
    expect(offenders).toEqual([]);
  });
});
