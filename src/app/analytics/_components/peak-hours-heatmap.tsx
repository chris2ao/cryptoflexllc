"use client";

import type { HourlyHeatmapRow } from "@/lib/analytics-types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getColor(value: number, max: number): string {
  if (max === 0 || value === 0) return "var(--surface-2)";
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
    return <p className="ax-empty">No data in range</p>;
  }

  return (
    <div className="ax-heatmap">
      <div className="ax-heatmap-inner">
        <div className="ax-heatmap-hours">
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="ax-heatmap-hour">
              {h % 3 === 0 ? `${h}` : ""}
            </div>
          ))}
        </div>

        {DAYS.map((day, di) => (
          <div key={day} className="ax-heatmap-row">
            <span className="ax-heatmap-day">{day}</span>
            {grid[di].map((views, hi) => (
              <div
                key={hi}
                className="ax-heatmap-cell"
                style={{ backgroundColor: getColor(views, maxViews) }}
                title={`${day} ${hi}:00, ${views} views`}
              />
            ))}
          </div>
        ))}

        <div className="ax-heatmap-legend">
          <span>Less</span>
          {[0, 0.25, 0.5, 0.75, 1].map((i) => (
            <div
              key={i}
              className="ax-heatmap-swatch"
              style={{ backgroundColor: getColor(i * maxViews, maxViews) }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
