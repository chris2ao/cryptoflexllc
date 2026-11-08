import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KnownBadPanel } from "./known-bad-panel";

describe("KnownBadPanel", () => {
  it("renders an IpLink per row and the reason chips", () => {
    render(
      <KnownBadPanel
        rows={[
          { ip: "1.1.1.1", reasons: ["abuse list", "Tor exit"], hits: 5, last: "2026-11-01T00:00:00Z" },
          { ip: "2.2.2.2", reasons: ["Spamhaus DROP"], hits: 2, last: "2026-11-02T00:00:00Z" },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: /1\.1\.1\.1/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /2\.2\.2\.2/ })).toBeInTheDocument();
    expect(screen.getByText("abuse list")).toBeInTheDocument();
    expect(screen.getByText("Tor exit")).toBeInTheDocument();
    expect(screen.getByText("Spamhaus DROP")).toBeInTheDocument();
  });

  it("shows the empty state", () => {
    render(<KnownBadPanel rows={[]} />);
    expect(screen.getByText("No known-bad visitors in range")).toBeInTheDocument();
  });
});
