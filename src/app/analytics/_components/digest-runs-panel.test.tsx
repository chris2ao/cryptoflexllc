import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DigestRunsPanel } from "./digest-runs-panel";

describe("DigestRunsPanel", () => {
  it("renders counts, seconds and click-through percent", () => {
    render(
      <DigestRunsPanel
        runs={[
          { ran_at: "2026-11-02T13:00:00Z", recipients: 8, sent: 7, failed: 1, duration_ms: 4500, clicks7d: 3, partial: false },
        ]}
      />,
    );
    expect(screen.getByText("4.5s")).toBeInTheDocument();
    expect(screen.getByText("37.5%")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("shows n/a when there were no recipients", () => {
    render(
      <DigestRunsPanel
        runs={[{ ran_at: "2026-11-02T13:00:00Z", recipients: 0, sent: 0, failed: 0, duration_ms: 100, clicks7d: 0, partial: false }]}
      />,
    );
    expect(screen.getByText("n/a")).toBeInTheDocument();
  });

  it("marks a run whose window is still open", () => {
    render(
      <DigestRunsPanel
        runs={[
          { ran_at: "2026-11-02T13:00:00Z", recipients: 8, sent: 8, failed: 0, duration_ms: 100, clicks7d: 2, partial: true },
          { ran_at: "2026-10-26T13:00:00Z", recipients: 8, sent: 8, failed: 0, duration_ms: 100, clicks7d: 4, partial: false },
        ]}
      />,
    );
    const marks = screen.getAllByTitle("Seven-day window still open");
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveTextContent("so far");
  });

  it("shows the empty state", () => {
    render(<DigestRunsPanel runs={[]} />);
    expect(
      screen.getByText("No digest sends recorded yet (the Monday cron writes one row per send)"),
    ).toBeInTheDocument();
  });
});
