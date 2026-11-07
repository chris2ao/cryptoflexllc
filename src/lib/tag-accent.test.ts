import { describe, it, expect } from "vitest";
import taxonomy from "@/content/tag-taxonomy.json";
import { getTagAccentVar } from "./tag-accent";

describe("getTagAccentVar", () => {
  it.each([
    ["Claude Code", "claude-code"],
    ["Security", "security"],
    ["Detection & SIEM", "security"],
    ["AI Agents", "ai"],
    ["Memory", "ai"],
    ["MCP", "ai"],
    ["Web Development", "nextjs"],
    ["Home Lab", "infrastructure"],
    ["Python & Data", "general"],
    ["Game Development", "general"],
    ["Open Source", "general"],
    ["Career & Life", "general"],
  ])("maps %s to the %s accent", (topic, accent) => {
    expect(getTagAccentVar([topic])).toBe(`var(--color-tag-${accent})`);
  });

  it("covers every taxonomy topic", () => {
    for (const topic of taxonomy.topics) {
      expect(getTagAccentVar([topic])).not.toBe("var(--color-tag-default)");
    }
  });

  it("uses the first recognized tag and falls back to the default", () => {
    expect(getTagAccentVar(["Unknown", "Home Lab", "Security"])).toBe(
      "var(--color-tag-infrastructure)"
    );
    expect(getTagAccentVar([])).toBe("var(--color-tag-default)");
  });
});
