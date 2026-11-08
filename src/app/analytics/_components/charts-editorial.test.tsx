import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { BotTrendChart, markerDates } from "./bot-trend-chart";
import { ScrollDepthChart } from "./scroll-depth-chart";
import { TimeOnPageChart } from "./time-on-page-chart";

vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

const CHARTS = [
  "api-response-chart.tsx",
  "auth-attempts-chart.tsx",
  "bot-trend-chart.tsx",
  "gmail-metrics-chart.tsx",
  "new-vs-returning-chart.tsx",
  "peak-hours-heatmap.tsx",
  "scroll-depth-chart.tsx",
  "subscriber-growth-chart.tsx",
  "time-on-page-chart.tsx",
];

describe("chart editorial port", () => {
  it.each(CHARTS)("%s uses no Tailwind-era classes", (file) => {
    const src = readFileSync(join(__dirname, file), "utf8");
    for (const bad of [
      "rounded-",
      "bg-card",
      "text-muted-foreground",
      "border-border",
      "panel-wrapper",
      'className="text-',
      'className="p-',
    ]) {
      expect(src).not.toContain(bad);
    }
  });

  const series = [
    { date: "2026-11-01", humans: 5, bots: 2 },
    { date: "2026-11-02", humans: 6, bots: 1 },
    { date: "2026-11-03", humans: 7, bots: 3 },
  ];

  it("markerDates keeps only dates present in the series", () => {
    expect(markerDates(series, ["2026-11-02", "2026-10-01"])).toEqual([
      "2026-11-02",
    ]);
    expect(markerDates(series, undefined)).toEqual([]);
  });

  it("BotTrendChart renders with series and markers", () => {
    const { container } = render(
      <BotTrendChart data={[]} series={series} markers={["2026-11-02"]} />,
    );
    expect(container.querySelector(".ax-chart")).not.toBeNull();
    expect(screen.queryByText("No data in range")).toBeNull();
  });

  it("BotTrendChart shows the empty state with no data", () => {
    render(<BotTrendChart data={[]} />);
    expect(screen.getByText("No data in range")).toBeTruthy();
  });

  it("ScrollDepthChart links rows by slug", () => {
    render(
      <ScrollDepthChart
        data={[
          {
            page_path: "/blog/some-post",
            depth_25: 4,
            depth_50: 3,
            depth_75: 2,
            depth_100: 1,
          },
        ]}
      />,
    );
    const link = screen.getByText("some-post").closest("a");
    expect(link?.getAttribute("href")).toBe("/blog/some-post");
  });

  it("TimeOnPageChart shows the empty state", () => {
    render(<TimeOnPageChart data={[]} />);
    expect(screen.getByText("No data in range")).toBeTruthy();
  });
});
