import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Files still on the old shadcn styling. The controller empties this list at
 * the wave checkpoint, after the chart port (Task 7) merges and wave 3
 * replaces ip-osint-panel.tsx. panel-wrapper.tsx goes once its last
 * consumers (session-archive-panel, gmail-runs-panel) are ported.
 */
export const PENDING_PORT: readonly string[] = [
  "api-response-chart.tsx",
  "auth-attempts-chart.tsx",
  "bot-trend-chart.tsx",
  "gmail-metrics-chart.tsx",
  "new-vs-returning-chart.tsx",
  "peak-hours-heatmap.tsx",
  "scroll-depth-chart.tsx",
  "subscriber-growth-chart.tsx",
  "time-on-page-chart.tsx",
  "ip-osint-panel.tsx",
  "panel-wrapper.tsx",
];

const FORBIDDEN = [
  "rounded-",
  "bg-card",
  "text-muted-foreground",
  "border-border",
  "components/ui/sheet",
  "components/ui/badge",
];

describe("analytics components use the editorial system only", () => {
  const files = readdirSync(__dirname).filter(
    (f) => f.endsWith(".tsx") && !PENDING_PORT.includes(f)
  );

  it("scans at least one file", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(files)("%s has no shadcn-era utilities", (file) => {
    const src = readFileSync(path.join(__dirname, file), "utf8");
    const hits = FORBIDDEN.filter((s) => src.includes(s));
    expect(hits).toEqual([]);
  });
});
