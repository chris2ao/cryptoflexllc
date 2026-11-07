import path from "path";
import { describe, it, expect } from "vitest";
import taxonomy from "@/content/tag-taxonomy.json";
import {
  computeTags,
  findTagsBlock,
  formatBlock,
  loadTaxonomy,
  planChanges,
  rewriteContent,
  splitFrontmatter,
} from "../../scripts/consolidate-tags.mjs";

const ROOT = process.cwd();
const tax = { topics: taxonomy.topics, map: taxonomy.map as Record<string, string | null> };

describe("tag taxonomy data", () => {
  it("lists the twelve topics with Claude Code last", () => {
    expect(taxonomy.topics).toHaveLength(12);
    expect(taxonomy.topics[taxonomy.topics.length - 1]).toBe("Claude Code");
  });

  it("maps every old tag to a listed topic or null", () => {
    for (const value of Object.values(tax.map)) {
      expect(value === null || tax.topics.includes(value)).toBe(true);
    }
  });
});

describe("consolidate-tags core", () => {
  it("parses inline and list tag blocks", () => {
    const inline = findTagsBlock('title: x\ntags: ["A", \'B, C\', D]\nauthor: y\n');
    expect(inline?.tags).toEqual(["A", "B, C", "D"]);
    const list = findTagsBlock('title: x\ntags:\n  - "A"\n  - B\nauthor: y\n');
    expect(list?.tags).toEqual(["A", "B"]);
  });

  it("orders by specificity, dedupes, drops nulls and caps at three", () => {
    const old = ["Claude Code", "Pi-hole", "UniFi", "Tutorial", "SIEM", "Security", "MCP"];
    expect(computeTags(old, "A home network story", tax)).toEqual([
      "Detection & SIEM",
      "Home Lab",
      "Security",
    ]);
  });

  it("keeps Claude Code only when the title or description is about it", () => {
    expect(computeTags(["Claude Code", "Next.js"], "A favicon story", tax)).toEqual([
      "Web Development",
    ]);
    expect(computeTags(["Claude Code", "Next.js"], "My Claude Code setup", tax)).toEqual([
      "Web Development",
      "Claude Code",
    ]);
  });

  it("reserves the Claude Code slot when a post maps to four topics", () => {
    const old = ["Claude Code", "Pi-hole", "SIEM", "Security", "MCP"];
    expect(computeTags(old, "Claude Code hooks", tax)).toEqual([
      "Detection & SIEM",
      "Home Lab",
      "Claude Code",
    ]);
  });

  it("matches the Claude Code rule on whole words only", () => {
    const keep = (text: string) => computeTags(["Claude Code", "Next.js"], text, tax);
    expect(keep("Verifying a webhook")).toEqual(["Web Development"]);
    expect(keep("Fixing session cookies")).toEqual(["Web Development"]);
    expect(keep("A GitHub Actions workflow")).toEqual(["Web Development"]);
    expect(keep("Claude Code hooks")).toEqual(["Web Development", "Claude Code"]);
  });

  it("keeps CRLF files on one ending style", () => {
    const src = '---\r\ntitle: "Lab"\r\ntags:\r\n  - Pi-hole\r\n  - Tutorial\r\nauthor: me\r\n---\r\n\r\nBody\r\n';
    const out = rewriteContent(src, tax);
    expect(out.content).toBe(
      '---\r\ntitle: "Lab"\r\ntags:\r\n  - Home Lab\r\nauthor: me\r\n---\r\n\r\nBody\r\n'
    );
  });

  it("does not end the frontmatter at a body line starting with four dashes", () => {
    const src = '---\ntitle: x\ntags: [Pi-hole]\n----\nauthor: me\n---\nBody\n';
    expect(rewriteContent(src, tax).content).toContain("author: me\n---\nBody");
  });

  it("reports a tag named constructor as unmapped", () => {
    const out = rewriteContent("---\ntitle: x\ntags: [constructor]\n---\nBody\n", tax);
    expect(out.unmapped).toEqual(["constructor"]);
  });

  it("falls back when nothing maps", () => {
    expect(computeTags(["Tutorial"], "A watch", tax)).toEqual(["Career & Life"]);
    expect(computeTags(["Tutorial"], "A Claude Code post", tax)).toEqual(["Claude Code"]);
  });

  it("quotes values containing an ampersand", () => {
    expect(formatBlock(["Detection & SIEM", "Security"])).toBe(
      'tags:\n  - "Detection & SIEM"\n  - Security'
    );
  });

  it("rewrites only the tags block and leaves other bytes alone", () => {
    const src = '---\ntitle: "Home lab"\ntags: ["Pi-hole", "Tutorial"]\nauthor: me\n---\n\nBody\n';
    const out = rewriteContent(src, tax);
    expect(out.content).toBe(
      '---\ntitle: "Home lab"\ntags:\n  - Home Lab\nauthor: me\n---\n\nBody\n'
    );
    expect(splitFrontmatter(out.content)).not.toBeNull();
    expect(rewriteContent(out.content, tax).changed).toBe(false);
  });
});

describe("post tags", () => {
  const plans = planChanges(ROOT, loadTaxonomy(ROOT));

  it("finds the posts", () => {
    expect(plans.length).toBeGreaterThan(90);
  });

  it("has no tag missing from the taxonomy map", () => {
    expect(plans.flatMap((p) => p.unmapped)).toEqual([]);
  });

  it("gives every live and backlog post one to three topics", () => {
    for (const p of plans) {
      expect(p.after.length, p.file).toBeGreaterThanOrEqual(1);
      expect(p.after.length, p.file).toBeLessThanOrEqual(3);
      p.after.forEach((t: string) => expect(tax.topics, p.file).toContain(t));
    }
  });

  it("reports no pending changes", () => {
    const pending = plans.filter((p) => p.changed).map((p) => path.basename(p.file));
    expect(pending).toEqual([]);
  });
});
