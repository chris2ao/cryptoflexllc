import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

vi.mock("recharts", () => {
  const Chart = ({ data }: { data: unknown }) => (
    <div data-testid="chart" data-points={JSON.stringify(data)} />
  );
  const Null = () => null;
  return {
    AreaChart: Chart,
    LineChart: Chart,
    BarChart: Chart,
    Area: Null,
    Line: Null,
    Bar: Null,
    CartesianGrid: Null,
    XAxis: Null,
    YAxis: Null,
  };
});
vi.mock("@/components/ui/chart", () => ({
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}));

import { TrendChartPanel, type TrendSeries } from "./trend-chart-panel";

const series: TrendSeries = {
  views: [{ date: "2026-11-01", total: 9, new: 5, returning: 4 }],
  readers: [{ date: "2026-11-01", value: 3 }],
  "read-through": [{ date: "2026-11-01", value: 41.5 }],
  "reader-minutes": [{ date: "2026-11-01", value: 12 }],
};

afterEach(() => {
  cleanup();
  delete document.body.dataset.axKpi;
});

describe("TrendChartPanel", () => {
  it("defaults to the views series", () => {
    render(<TrendChartPanel series={series} days={30} />);
    expect(screen.getByText("Views")).toBeTruthy();
    expect(screen.getByTestId("chart").getAttribute("data-points")).toContain('"total":9');
  });

  it.each([
    ["readers", "Readers", '"value":3'],
    ["read-through", "Read-through %", '"value":41.5'],
    ["reader-minutes", "Reader minutes", '"value":12'],
  ])("shows the %s series when that tile is active", (id, label, points) => {
    document.body.dataset.axKpi = id;
    render(<TrendChartPanel series={series} days={30} />);
    expect(screen.getByText(label)).toBeTruthy();
    expect(screen.getByTestId("chart").getAttribute("data-points")).toContain(points);
  });

  it("falls back to No data in range when the readers series is empty", () => {
    document.body.dataset.axKpi = "readers";
    render(<TrendChartPanel series={{ ...series, readers: [] }} days={30} />);
    expect(screen.getByText("Readers")).toBeTruthy();
    expect(screen.getByText("No data in range")).toBeTruthy();
    expect(screen.queryByTestId("chart")).toBeNull();
  });
});
