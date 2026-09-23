import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Every tracked file in public/ is copied into every Vercel deployment, and
 * Hobby Deployment Storage is capped at 10 GB. Large media belongs in the
 * Blob store (see src/lib/asset-url.ts); images should be WebP or JPEG sized
 * for the page. This guard keeps a single oversized upload from failing
 * silently. Gitignored local files are skipped because they never deploy.
 */
const MAX_BYTES = 1.5 * 1024 * 1024;

function trackedPublicFiles(): string[] {
  const out = execFileSync("git", ["ls-files", "-z", "public"], { encoding: "utf8" });
  return out.split("\0").filter((file) => file && existsSync(file));
}

describe("public/ asset budget", () => {
  it(`has no tracked file larger than ${MAX_BYTES / 1024 / 1024} MB`, () => {
    const oversized = trackedPublicFiles()
      .map((file) => ({ file, size: statSync(file).size }))
      .filter(({ size }) => size > MAX_BYTES)
      .map(
        ({ file, size }) =>
          `${path.relative("public", file)} (${(size / 1024 / 1024).toFixed(1)} MB)`,
      );

    expect(
      oversized,
      "Convert images to WebP/JPEG or move media to Vercel Blob",
    ).toEqual([]);
  });

  it("tracks every image referenced from src/", () => {
    // .gitignore excludes public/blog/**/slides/, so a referenced image there
    // exists locally but 404s in production unless it was force-added.
    const tracked = new Set(trackedPublicFiles());
    const sources = execFileSync("git", ["ls-files", "-z", "src"], { encoding: "utf8" })
      .split("\0")
      .filter((file) => /\.(mdx|md|tsx?)$/.test(file) && !file.includes(".test."))
      .filter((file) => existsSync(file));
    const imageRef =
      /(?<![\w:/.])(\/(?:blog|images|resources)\/[\w./%-]+\.(?:png|webp|jpe?g|gif|svg))/g;

    const untracked = sources.flatMap((file) =>
      [...readFileSync(file, "utf8").matchAll(imageRef)]
        .map((match) => match[1])
        .filter((ref) => !tracked.has(`public${ref}`))
        .map((ref) => `${file}: ${ref}`),
    );

    expect(untracked, "git add -f the image, or fix the reference").toEqual([]);
  });
});
