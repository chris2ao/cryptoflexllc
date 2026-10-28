import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

/**
 * scripts/vercel-ignore-build.sh decides whether Vercel builds a commit.
 * Each build is stored as a full deployment against the 10 GB Hobby
 * Deployment Storage cap, so docs-only commits should not build, and
 * anything the site reads always must.
 */
const SCRIPT = path.resolve("scripts/vercel-ignore-build.sh");

let repo: string;

function git(...args: string[]): string {
  return execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim();
}

function commitFile(file: string, body = "x"): string {
  mkdirSync(path.dirname(path.join(repo, file)), { recursive: true });
  writeFileSync(path.join(repo, file), body);
  git("add", "-A");
  git("commit", "-q", "-m", `change ${file}`);
  return git("rev-parse", "HEAD");
}

function run(previousSha?: string): number {
  const env = { ...process.env };
  if (previousSha === undefined) delete env.VERCEL_GIT_PREVIOUS_SHA;
  else env.VERCEL_GIT_PREVIOUS_SHA = previousSha;
  return spawnSync("bash", [SCRIPT], { cwd: repo, env }).status ?? -1;
}

beforeEach(() => {
  repo = mkdtempSync(path.join(tmpdir(), "ignore-build-"));
  git("init", "-q");
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "Test");
  commitFile("src/app/page.tsx");
});

afterEach(() => {
  rmSync(repo, { recursive: true, force: true });
});

describe("vercel-ignore-build.sh", () => {
  it("skips a commit that only touches docs and the changelog", () => {
    const base = git("rev-parse", "HEAD");
    commitFile("CHANGELOG.md");
    commitFile("docs/plans/next.md");
    expect(run(base)).toBe(0);
  });

  it("builds when site source changes alongside docs", () => {
    const base = git("rev-parse", "HEAD");
    commitFile("CHANGELOG.md");
    commitFile("src/content/blog/new-post.mdx");
    expect(run(base)).toBe(1);
  });

  it("builds when a public asset or config file changes", () => {
    const base = git("rev-parse", "HEAD");
    commitFile("public/blog/new-post/cover.jpg");
    expect(run(base)).toBe(1);

    const next = git("rev-parse", "HEAD");
    commitFile("next.config.ts");
    expect(run(next)).toBe(1);
  });

  it("builds a markdown file that lives inside the site source", () => {
    const base = git("rev-parse", "HEAD");
    commitFile("src/content/notes.md");
    expect(run(base)).toBe(1);
  });

  it("builds when there is no previous deployment to compare against", () => {
    commitFile("CHANGELOG.md");
    expect(run()).toBe(1);
    expect(run("0000000000000000000000000000000000000000")).toBe(1);
  });
});
