import matter from "gray-matter";

/**
 * Safe frontmatter parsing.
 *
 * gray-matter ships a `javascript` engine that runs `eval()` on the frontmatter
 * body when the opening fence declares a JS language (for example `---js`). MDX
 * content files are executed by the build/render pipeline, and this repository is
 * public, so a content pull request could add such a file and reach `eval` in CI,
 * a preview build, or the production function.
 *
 * This wrapper closes that path two ways:
 *   1. It refuses any opening fence that declares a language, mirroring
 *      gray-matter's own rule that a `---` delimiter followed by a character that
 *      is neither a dash nor whitespace names an engine. Only a plain `---` YAML
 *      fence is allowed through.
 *   2. As defense in depth it replaces the non-YAML engines with a function that
 *      throws, so even a future gray-matter alias cannot reach `eval`.
 *
 * See docs/security/security-review-2026-08-13.md (F-C1).
 */

// Matches an opening frontmatter fence that declares a language, e.g. `---js`.
// A bare `---` (next char is whitespace/newline) and a `----` horizontal rule
// (next char is a dash) do not match, matching gray-matter's delimiter logic.
const LANGUAGE_FENCE = /^---(?![-\s])([^\r\n]+)/;

const blockedEngine = {
  parse: (): never => {
    throw new Error(
      "Non-YAML frontmatter engines are disabled (security review F-C1). Use a plain `---` fence."
    );
  },
  stringify: (): never => {
    throw new Error(
      "Non-YAML frontmatter engines are disabled (security review F-C1)."
    );
  },
};

const SAFE_ENGINES = {
  javascript: blockedEngine,
  js: blockedEngine,
  coffee: blockedEngine,
  coffeescript: blockedEngine,
  toml: blockedEngine,
};

/**
 * Parse frontmatter with the YAML engine only. Throws on any non-YAML fence
 * language rather than executing it.
 */
export function parseFrontmatter(input: string): matter.GrayMatterFile<string> {
  // Strip an optional leading byte-order mark before inspecting the fence.
  const stripped =
    input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
  const declared = LANGUAGE_FENCE.exec(stripped);
  if (declared) {
    throw new Error(
      `Refusing to parse frontmatter: the opening fence declares a language ("${declared[1].trim()}"). ` +
        "Only a plain `---` YAML fence is allowed (security review F-C1)."
    );
  }
  return matter(input, { language: "yaml", engines: SAFE_ENGINES });
}
