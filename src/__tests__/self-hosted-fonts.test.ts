/**
 * Self-Hosted Font Tests
 *
 * next/font/google downloads font files from Google at build time. About 1 in
 * 60 Google Fonts responses use an extensionless font URL that Turbopack
 * cannot resolve (vercel/next.js#99114), which fails `next build` with
 * "next/font/google queries have exactly one entry". Fonts are vendored in
 * src/fonts and loaded with next/font/local so builds never depend on Google.
 */

import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SRC_DIR = path.join(process.cwd(), "src");
const FONTS_DIR = path.join(SRC_DIR, "fonts");
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs"];

function listSourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listSourceFiles(fullPath);
    return SOURCE_EXTENSIONS.includes(path.extname(entry.name)) ? [fullPath] : [];
  });
}

function referencedFontFiles(): string[] {
  const fontModules = fs.readdirSync(FONTS_DIR).filter((file) => file.endsWith(".ts"));
  const references = fontModules.flatMap((file) => {
    const source = fs.readFileSync(path.join(FONTS_DIR, file), "utf-8");
    return [...source.matchAll(/path:\s*["']\.\/([^"']+\.woff2)["']/g)].map((m) => m[1]);
  });
  return [...new Set(references)];
}

describe("Self-hosted fonts", () => {
  it("no source file imports next/font/google", () => {
    const offenders = listSourceFiles(SRC_DIR)
      .filter((file) => !file.endsWith(".test.ts") && !file.endsWith(".test.tsx"))
      .filter((file) => /["']next\/font\/google["']/.test(fs.readFileSync(file, "utf-8")))
      .map((file) => path.relative(process.cwd(), file));

    expect(offenders).toEqual([]);
  });

  it("every font file referenced by a src/fonts module exists", () => {
    const files = referencedFontFiles();
    expect(files.length).toBeGreaterThan(0);

    const missing = files.filter((file) => !fs.existsSync(path.join(FONTS_DIR, file)));
    expect(missing).toEqual([]);
  });

  it("ships the OFL licence for every vendored font family", () => {
    const families = new Set(referencedFontFiles().map((file) => file.split("-latin-")[0]));

    const missing = [...families].filter(
      (family) => !fs.existsSync(path.join(FONTS_DIR, `${family}-OFL.txt`)),
    );
    expect(missing).toEqual([]);
  });
});
