/** Maps a post's first recognized topic to its card accent-bar CSS variable. */
const tagVarMap: Record<string, string> = {
  "Claude Code": "var(--color-tag-claude-code)",
  Security: "var(--color-tag-security)",
  "Detection & SIEM": "var(--color-tag-security)",
  "AI Agents": "var(--color-tag-ai)",
  Memory: "var(--color-tag-ai)",
  MCP: "var(--color-tag-ai)",
  "Web Development": "var(--color-tag-nextjs)",
  "Home Lab": "var(--color-tag-infrastructure)",
  "Python & Data": "var(--color-tag-general)",
  "Game Development": "var(--color-tag-general)",
  "Open Source": "var(--color-tag-general)",
  "Career & Life": "var(--color-tag-general)",
};

export function getTagAccentVar(tags: string[]): string {
  for (const tag of tags) {
    if (tagVarMap[tag]) return tagVarMap[tag];
  }
  return "var(--color-tag-default)";
}
