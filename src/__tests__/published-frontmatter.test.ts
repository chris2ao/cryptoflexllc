import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";
import { parseFrontmatter } from "@/lib/frontmatter";

/**
 * `published: false` hides a live post everywhere, so hiding must be
 * deliberate: a hidden post fails CI unless its slug is listed in
 * src/content/hidden-posts.json. This also catches a pipeline that writes
 * `published: false` straight into src/content/blog, which would otherwise
 * ship a post nobody can see while every other check passes.
 */

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "src/content/blog");
const BACKLOG_DIR = path.join(ROOT, "src/content/backlog");
const HIDDEN_LIST = path.join(ROOT, "src/content/hidden-posts.json");

type Entry = { slug: string; data: Record<string, unknown> };

function readDir(dir: string): Entry[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => ({
      slug: f.replace(/\.mdx$/, ""),
      data: parseFrontmatter(fs.readFileSync(path.join(dir, f), "utf8")).data,
    }));
}

function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = temp;
    }
  }
  return row[b.length];
}

/** Keys like "Published" or "pubished" that the loader would silently ignore. */
function nearMissKeys(data: Record<string, unknown>): string[] {
  return Object.keys(data).filter(
    (key) => key !== "published" && editDistance(key.toLowerCase(), "published") <= 2
  );
}

const blog = readDir(BLOG_DIR);
const backlog = readDir(BACKLOG_DIR);
const allowed: string[] = JSON.parse(fs.readFileSync(HIDDEN_LIST, "utf8")).slugs;

describe("published frontmatter", () => {
  it("reads the live posts", () => {
    expect(blog.length).toBeGreaterThan(0);
  });

  it("uses only true or false for published on live posts", () => {
    const bad = blog
      .filter((p) => "published" in p.data && typeof p.data.published !== "boolean")
      .map((p) => `${p.slug}: published: ${JSON.stringify(p.data.published)}`);
    expect(bad, "write published: true or published: false").toEqual([]);
  });

  it("hides only the posts listed in src/content/hidden-posts.json", () => {
    const hidden = blog.filter((p) => p.data.published === false).map((p) => p.slug).sort();
    expect(hidden, "a hidden post must be listed in src/content/hidden-posts.json").toEqual(
      [...allowed].sort()
    );
  });

  it("has no misspelled or miscapitalized published key", () => {
    const misses = [...blog, ...backlog].flatMap((p) =>
      nearMissKeys(p.data).map((key) => `${p.slug}: ${key}`)
    );
    expect(misses, "the loader only reads the exact key `published`").toEqual([]);
  });

  it("keeps the published flag out of backlog drafts", () => {
    const flagged = backlog.filter((p) => "published" in p.data).map((p) => p.slug);
    expect(flagged, "drafts publishing straight to src/content/blog would go live hidden").toEqual(
      []
    );
  });
});
