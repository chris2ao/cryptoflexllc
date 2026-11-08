import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ShippingPanel } from "./shipping-panel";

describe("ShippingPanel", () => {
  it("shows commits with the 14-day figure, deploys and the last deploy", () => {
    render(
      <ShippingPanel
        shipping={{
          available: true, commits7d: 12,
          commits14d: 30,
          deploys7d: 5,
          lastDeploy: { state: "READY", createdAt: Date.now() - 2 * 3_600_000, commitMessage: "x" },
        }}
      />,
    );
    expect(screen.getByText("Commits last 7 days")).toBeInTheDocument();
    expect(screen.getByText(/30 in 14d/)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText(/READY · 2h ago/)).toBeInTheDocument();
  });

  it("handles a missing last deploy", () => {
    render(
      <ShippingPanel shipping={{ available: true, commits7d: 0, commits14d: 0, deploys7d: 0, lastDeploy: null }} />,
    );
    expect(screen.getByText("none")).toBeInTheDocument();
  });
});

describe("ShippingPanel unavailable", () => {
  it("says the sources did not answer instead of showing zeros", () => {
    render(
      <ShippingPanel
        shipping={{ available: false, commits7d: 0, commits14d: 0, deploys7d: 0, lastDeploy: null }}
      />,
    );
    expect(screen.getByText(/Shipping data unavailable/)).toBeInTheDocument();
  });
});
