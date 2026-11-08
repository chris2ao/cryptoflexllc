import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Files still on the old shadcn styling. Wave 3 replaces ip-osint-panel.tsx,
 * which empties this list.
 */
export const PENDING_PORT: readonly string[] = ["ip-osint-panel.tsx"];

const FORBIDDEN = [
  "rounded-",
  "bg-card",
  "text-muted-foreground",
  "border-border",
  "components/ui/sheet",
  "components/ui/badge",
];

describe("analytics components use the editorial system only", () => {
  const files = readdirSync(__dirname).filter(
    (f) =>
      f.endsWith(".tsx") && !f.endsWith(".test.tsx") && !PENDING_PORT.includes(f)
  );

  it("scans at least one file", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(files)("%s has no shadcn-era utilities", (file) => {
    const src = readFileSync(path.join(__dirname, file), "utf8");
    const hits = FORBIDDEN.filter((s) => src.includes(s));
    expect(hits).toEqual([]);
  });
});
