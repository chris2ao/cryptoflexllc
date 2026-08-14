/** Maps a post's first recognized tag to its card accent-bar CSS variable. */
const tagVarMap: Record<string, string> = {
  "Claude Code": "var(--color-tag-claude-code)",
  Security: "var(--color-tag-security)",
  AI: "var(--color-tag-ai)",
  "Next.js": "var(--color-tag-nextjs)",
  DevOps: "var(--color-tag-general)",
  Analytics: "var(--color-tag-general)",
  Infrastructure: "var(--color-tag-infrastructure)",
};

export function getTagAccentVar(tags: string[]): string {
  for (const tag of tags) {
    if (tagVarMap[tag]) return tagVarMap[tag];
  }
  return "var(--color-tag-default)";
}
