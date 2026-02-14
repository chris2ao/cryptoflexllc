"use client";

import type { HourlyHeatmapRow } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getColor(value: number, max: number): string {
  if (max === 0 || value === 0) return "var(--muted)";
  const intensity = value / max;
  // oklch ramp from muted to primary
  if (intensity < 0.25) return "oklch(0.35 0.06 195)";
  if (intensity < 0.5) return "oklch(0.45 0.10 195)";
  if (intensity < 0.75) return "oklch(0.60 0.13 195)";
  return "oklch(0.75 0.15 195)";
}

export function PeakHoursHeatmap({ data }: { data: HourlyHeatmapRow[] }) {
  // Build a 7x24 grid (day x hour)
  const grid: number[][] = Array.from({ length: 7 }, () =>
    Array(24).fill(0),
  );
  let maxViews = 0;

  for (const row of data) {
    grid[row.day_of_week][row.hour] = row.views;
    if (row.views > maxViews) maxViews = row.views;
  }

  if (data.length === 0) {
    return (
      <PanelWrapper
        title="Peak Hours"
        tooltip="Traffic intensity by day of week and hour — find the best times to publish"
      >
        <p className="text-muted-foreground text-sm text-center py-8">
          No data yet
        </p>
      </PanelWrapper>
    );
  }

  return (
    <PanelWrapper
      title="Peak Hours"
      tooltip="Traffic intensity by day of week and hour — find the best times to publish"
    >
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex ml-10 mb-1">
            {Array.from({ length: 24 }, (_, h) => (
              <div
                key={h}
                className="flex-1 text-center text-[10px] text-muted-foreground"
              >
                {h % 3 === 0 ? `${h}` : ""}
              </div>
            ))}
          </div>

          {/* Rows */}
          {DAYS.map((day, di) => (
            <div key={day} className="flex items-center gap-1 mb-0.5">
              <span className="w-9 text-xs text-muted-foreground text-right pr-1">
                {day}
              </span>
              {grid[di].map((views, hi) => (
                <div
                  key={hi}
                  className="flex-1 aspect-square rounded-sm transition-colors"
                  style={{ backgroundColor: getColor(views, maxViews) }}
                  title={`${day} ${hi}:00 — ${views} views`}
                />
              ))}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-muted-foreground">
            <span>Less</span>
            {[0, 0.25, 0.5, 0.75, 1].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: getColor(i * maxViews, maxViews),
                }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </PanelWrapper>
  );
}
