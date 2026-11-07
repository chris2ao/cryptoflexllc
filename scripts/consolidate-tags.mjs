#!/usr/bin/env node
/**
 * Consolidates post tags onto the twelve-topic taxonomy in
 * src/content/tag-taxonomy.json. Rewrites only the `tags:` block of each
 * frontmatter, in list form, and leaves every other byte of the file alone.
 *
 *   node scripts/consolidate-tags.mjs           apply and print a summary
 *   node scripts/consolidate-tags.mjs --check   list pending changes, exit 1 if any
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CLAUDE_CODE = "Claude Code";
const FALLBACK = "Career & Life";
const MAX_TAGS = 3;
const CLAUDE_RE =
  /\b(?:claude|harness|hooks?|skills?|subagents?|agent teams?|mcp|plasticity|homunculus)\b/i;
const CONTENT_DIRS = ["src/content/blog", "src/content/backlog"];

function unquote(raw) {
  const v = raw.trim();
  if (v.length >= 2 && v.startsWith("'") && v.endsWith("'")) {
    return v.slice(1, -1).replace(/''/g, "'");
  }
  if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) {
    return v.slice(1, -1).replace(/\\"/g, '"');
  }
  return v;
}

/** Splits `a, "b, c", 'd'` on commas that sit outside quotes. */
function splitInline(body) {
  const parts = [];
  let current = "";
  let quote = null;
  for (const ch of body) {
    if (quote) {
      current += ch;
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
    } else if (ch === ",") {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  return [...parts, current].map(unquote).filter((t) => t !== "");
}

/** Returns the frontmatter text and its span, or null when there is no fence. */
export function splitFrontmatter(content) {
  if (!/^---\r?\n/.test(content)) return null;
  const open = content.indexOf("\n") + 1;
  const rest = content.slice(open - 1);
  const m = /\n---(?:\r?\n|$)/.exec(rest);
  if (!m) return null;
  const close = open - 1 + m.index;
  return { fm: content.slice(open, close + 1), start: open, end: close + 1 };
}

/** Locates the `tags:` block (inline or list form) inside frontmatter text. */
export function findTagsBlock(fm) {
  const lines = fm.split("\n");
  const idx = lines.findIndex((l) => /^tags:/.test(l));
  if (idx === -1) return null;
  const eol = lines[idx].endsWith("\r") ? "\r\n" : "\n";
  const head = lines[idx].replace(/^tags:\s*/, "").replace(/\r$/, "");
  let last = idx;
  let tags;
  if (head.startsWith("[")) {
    tags = splitInline(head.replace(/^\[/, "").replace(/\]\s*$/, ""));
  } else {
    tags = [];
    while (last + 1 < lines.length && /^\s*-\s+/.test(lines[last + 1])) {
      last += 1;
      tags = [...tags, unquote(lines[last].replace(/^\s*-\s+/, "").replace(/\r$/, ""))];
    }
  }
  const offset = lines.slice(0, idx).reduce((n, l) => n + l.length + 1, 0);
  const length = lines.slice(idx, last + 1).reduce((n, l) => n + l.length + 1, 0) - 1;
  return { tags, eol, from: offset, to: offset + length };
}

/** Reads a scalar frontmatter field, including folded and multi-line values. */
export function readField(fm, key) {
  const lines = fm.split("\n");
  const idx = lines.findIndex((l) => l.startsWith(`${key}:`));
  if (idx === -1) return "";
  const tail = [];
  for (let i = idx + 1; i < lines.length && /^\s+\S/.test(lines[i]); i += 1) {
    tail.push(lines[i].trim());
  }
  return [lines[idx].slice(key.length + 1).trim(), ...tail].join(" ");
}

function orderOf(topics) {
  return (a, b) => topics.indexOf(a) - topics.indexOf(b);
}

/** A topic maps to itself, so a rerun on consolidated posts changes nothing. */
function lookup(tag, { topics, map }) {
  if (topics.includes(tag)) return tag;
  return Object.hasOwn(map, tag) ? map[tag] : undefined;
}

/** Maps old tags to at most three topics, most specific first. */
export function computeTags(oldTags, text, taxonomy) {
  const { topics } = taxonomy;
  const mapped = oldTags.map((t) => lookup(t, taxonomy)).filter((t) => typeof t === "string");
  const unique = mapped.filter((t, i) => mapped.indexOf(t) === i);
  const aboutClaude = CLAUDE_RE.test(text);
  const ordered = [...unique].sort(orderOf(topics));
  const kept = ordered.filter((t) => t !== CLAUDE_CODE || aboutClaude);
  if (kept.length === 0) return [aboutClaude ? CLAUDE_CODE : FALLBACK];
  if (kept.length > MAX_TAGS && kept.includes(CLAUDE_CODE)) {
    const others = kept.filter((t) => t !== CLAUDE_CODE);
    return [...others.slice(0, MAX_TAGS - 1), CLAUDE_CODE];
  }
  return kept.slice(0, MAX_TAGS);
}

function formatTag(tag) {
  return /[&:#]/.test(tag) ? `"${tag}"` : tag;
}

export function formatBlock(tags, eol = "\n") {
  return ["tags:", ...tags.map((t) => `  - ${formatTag(t)}`)].join(eol);
}

/** Pure rewrite of one file. Returns the new content and the tag change. */
export function rewriteContent(content, taxonomy) {
  const parts = splitFrontmatter(content);
  const block = parts ? findTagsBlock(parts.fm) : null;
  if (!parts || !block) return { content, changed: false, before: [], after: [], unmapped: [] };
  const text = `${readField(parts.fm, "title")} ${readField(parts.fm, "description")}`;
  const after = computeTags(block.tags, text, taxonomy);
  const unmapped = block.tags.filter((t) => lookup(t, taxonomy) === undefined);
  const base = parts.start;
  const tail = block.eol === "\r\n" ? "\r" : "";
  const next =
    content.slice(0, base + block.from) +
    formatBlock(after, block.eol) +
    tail +
    content.slice(base + block.to);
  return { content: next, changed: next !== content, before: block.tags, after, unmapped };
}

export function loadTaxonomy(root) {
  const file = path.join(root, "src/content/tag-taxonomy.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/** Computes the rewrite for every post file without writing anything. */
export function planChanges(root, taxonomy = loadTaxonomy(root)) {
  return CONTENT_DIRS.flatMap((dir) => {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) return [];
    return fs
      .readdirSync(abs)
      .filter((f) => f.endsWith(".mdx"))
      .sort()
      .map((f) => {
        const file = path.join(dir, f);
        const original = fs.readFileSync(path.join(root, file), "utf8");
        return { file, ...rewriteContent(original, taxonomy) };
      });
  });
}

export function countTags(plans, field) {
  return plans
    .flatMap((p) => p[field])
    .reduce((acc, t) => ({ ...acc, [t]: (acc[t] ?? 0) + 1 }), {});
}

function printCensus(label, counts) {
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  console.log(`${label}: ${rows.length} distinct tags`);
  rows.slice(0, 20).forEach(([t, n]) => console.log(`  ${String(n).padStart(4)}  ${t}`));
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const plans = planChanges(root);
  const pending = plans.filter((p) => p.changed);
  const unmapped = plans.flatMap((p) => p.unmapped.map((t) => `${p.file}: ${t}`));
  if (unmapped.length > 0) {
    console.error(`Unmapped tags (add them to the taxonomy map):\n${unmapped.join("\n")}`);
    process.exit(1);
  }
  if (process.argv.includes("--check")) {
    if (pending.length > 0) {
      console.error(`${pending.length} files have tags outside the taxonomy:`);
      pending.forEach((p) => console.error(`  ${p.file}`));
      process.exit(1);
    }
    console.log("Tags already match the taxonomy.");
    return;
  }
  pending.forEach((p) => fs.writeFileSync(path.join(root, p.file), p.content));
  console.log(`Changed ${pending.length} of ${plans.length} files.`);
  printCensus("Before", countTags(plans, "before"));
  printCensus("After", countTags(plans, "after"));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
