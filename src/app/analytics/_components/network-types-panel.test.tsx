import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NetworkTypesPanel } from "./network-types-panel";

describe("NetworkTypesPanel", () => {
  it("renders the five types in order with visitors and views", () => {
    render(
      <NetworkTypesPanel
        data={[
          { type: "datacenter", visitors: 3, views: 9 },
          { type: "unknown", visitors: 1, views: 1 },
          { type: "residential", visitors: 10, views: 40 },
          { type: "tor", visitors: 0, views: 0 },
          { type: "proxy", visitors: 2, views: 5 },
        ]}
      />,
    );
    const names = screen.getAllByRole("listitem").map((li) => li.querySelector(".name")?.textContent ?? "");
    expect(names[0]).toContain("Residential");
    expect(names[0]).toContain("40 views");
    expect(names.map((n) => n.split(" · ")[0])).toEqual([
      "Residential",
      "Datacenter",
      "Proxy or VPN",
      "Tor",
      "Unknown",
    ]);
  });
});
