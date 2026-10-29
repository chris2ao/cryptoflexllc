import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { parseFrontmatter } from "./frontmatter";

/**
 * Image format policy from docs/plans/deployment-storage-reduction-plan.md
 * (section B): every Vercel deploy copies all of public/, so
 *   - covers (coverImage, served as og:image) are JPEG, since some link-preview
 *     crawlers reject WebP;
 *   - inline images over 300 KB are WebP.
 * Files are read from disk rather than from git, so the blog pipeline's
 * finalize stage catches a new, still-uncommitted post before it ships.
 */
const MAX_INLINE_PNG_BYTES = 300 * 1024;
const CONTENT_DIRS = ["src/content/blog", "src/content/backlog"];
const IMAGE_REF =
  /(?<![\w:/.])(\/(?:blog|images|resources)\/[\w./%-]+\.png)\b/gi;

function postFiles(): string[] {
  return CONTENT_DIRS.filter((dir) => existsSync(dir)).flatMap((dir) =>
    readdirSync(dir)
      .filter((name) => name.endsWith(".mdx"))
      .map((name) => path.join(dir, name)),
  );
}

function sourceFiles(): string[] {
  return readdirSync("src", { recursive: true, encoding: "utf8" })
    .map((rel) => path.join("src", rel))
    .filter((file) => /\.(mdx|md|tsx?)$/.test(file) && !file.includes(".test."));
}

describe("blog image formats", () => {
  it("uses a JPEG for every coverImage", () => {
    const notJpeg = postFiles()
      .map((file) => ({ file, cover: parseFrontmatter(readFileSync(file, "utf8")).data.coverImage }))
      .filter(({ cover }) => typeof cover === "string" && !/\.jpe?g$/i.test(cover.trim()))
      .map(({ file, cover }) => `${file}: ${cover}`);

    expect(
      notJpeg,
      "Publish covers with ~/.claude/scripts/blog-image-convert.py cover (JPEG, 1600 px, q85)",
    ).toEqual([]);
  });

  it(`references no PNG over ${MAX_INLINE_PNG_BYTES / 1024} KB`, () => {
    const oversized = sourceFiles().flatMap((file) =>
      [...readFileSync(file, "utf8").matchAll(IMAGE_REF)]
        .map((match) => match[1])
        .filter((ref) => existsSync(`public${ref}`))
        .map((ref) => ({ ref, size: statSync(`public${ref}`).size }))
        .filter(({ size }) => size > MAX_INLINE_PNG_BYTES)
        .map(({ ref, size }) => `${file}: ${ref} (${Math.round(size / 1024)} KB)`),
    );

    expect(
      oversized,
      "Convert with ~/.claude/scripts/blog-image-convert.py inline (WebP, q82) and update the reference",
    ).toEqual([]);
  });
});
