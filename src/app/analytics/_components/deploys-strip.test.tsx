import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeploysStrip, relativeTime, stateTone } from "./deploys-strip";

const now = Date.now();
const mk = (id: string, state: string, ago: number, msg: string) => ({
  id,
  state,
  createdAt: now - ago,
  commitMessage: msg,
  commitSha: `sha${id}000000`,
});

describe("DeploysStrip", () => {
  it("renders one chip per deployment with tone, time and message", () => {
    const { container } = render(
      <DeploysStrip
        deployments={[
          mk("1", "READY", 2 * 3_600_000, "ship it"),
          mk("2", "ERROR", 3 * 86_400_000, "broke it"),
          mk("3", "CANCELED", 60_000, "skipped"),
          mk("4", "BUILDING", 0, "running"),
        ]}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("2h ago")).toBeInTheDocument();
    expect(screen.getByText("3d ago")).toBeInTheDocument();
    expect(screen.getByText("ship it")).toBeInTheDocument();
    expect(container.querySelectorAll(".ax-ddot.ok")).toHaveLength(1);
    expect(container.querySelectorAll(".ax-ddot.err")).toHaveLength(1);
    expect(container.querySelectorAll(".ax-ddot.muted")).toHaveLength(1);
    expect(container.querySelectorAll(".ax-ddot.warn")).toHaveLength(1);
    expect(screen.getAllByRole("listitem")[0]).toHaveAttribute("title", "sha1000");
  });

  it("shows the empty state", () => {
    render(<DeploysStrip deployments={[]} />);
    expect(screen.getByText("No deployments returned")).toBeInTheDocument();
  });

  it("maps tones and relative times", () => {
    expect(stateTone("QUEUED")).toBe("warn");
    expect(relativeTime(now - 5 * 60_000, now)).toBe("5m ago");
  });
});
