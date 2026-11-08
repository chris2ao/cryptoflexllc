import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WebAnalyticsCard, ratioLabel } from "./web-analytics-card";

const base = { ours: { pageviews: 100, visitors: 40 }, daily: [], days: 30 };

describe("WebAnalyticsCard", () => {
  it("prints the enable command when not enabled", () => {
    render(<WebAnalyticsCard {...base} state="not-enabled" theirs={null} />);
    expect(screen.getByText("Web Analytics is not enabled on this project")).toBeInTheDocument();
    expect(screen.getByText("vercel project web-analytics enable cryptoflexllc").tagName).toBe("CODE");
  });

  it("prints unavailable", () => {
    render(<WebAnalyticsCard {...base} state="unavailable" theirs={null} />);
    expect(screen.getByText("Vercel API unavailable")).toBeInTheDocument();
  });

  it("shows both counts and the ratio when ok", () => {
    render(
      <WebAnalyticsCard {...base} state="ok" theirs={{ pageviews: 120, visitors: 60 }} />,
    );
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("Vercel counts 1.2x ours")).toBeInTheDocument();
    expect(screen.getByText(/counts humans in scope/)).toBeInTheDocument();
  });

  it("formats a sub-one ratio and a zero baseline", () => {
    expect(ratioLabel(80, 100)).toBe("Vercel counts 0.8x ours");
    expect(ratioLabel(5, 0)).toMatch(/zero/);
  });
});
