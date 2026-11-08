// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { AnalyticsShell } from "./analytics-shell";

Element.prototype.scrollIntoView = vi.fn();

function setup(currentDays = 7) {
  return render(
    <AnalyticsShell
      activeTab="readers"
      currentDays={currentDays}
      scope="all"
      meta={<span>META-NODE</span>}
    >
      <div>child</div>
    </AnalyticsShell>
  );
}

describe("AnalyticsShell", () => {
  it("highlights no range chip for a non-preset days value", () => {
    setup(45);
    const group = screen.getByRole("group", { name: "Date range" });
    const chips = within(group).getAllByRole("button");
    expect(chips.length).toBeGreaterThan(0);
    for (const chip of chips) {
      expect(chip.getAttribute("aria-pressed")).toBe("false");
      expect(chip.className).toBe("");
    }
  });

  it("renders seven tab links", () => {
    setup();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(7);
    expect(tabs[0].tagName).toBe("A");
  });

  it("marks only the active tab as selected", () => {
    setup();
    const selected = screen
      .getAllByRole("tab")
      .filter((t) => t.getAttribute("aria-selected") === "true");
    expect(selected).toHaveLength(1);
    expect(selected[0].getAttribute("data-tab-id")).toBe("readers");
  });

  it("builds hrefs with tab, days and scope", () => {
    setup();
    expect(screen.getAllByRole("tab")[0].getAttribute("href")).toBe(
      "/analytics?tab=overview&days=7&scope=all"
    );
  });

  it("has a scope segment with the prop pressed", () => {
    setup();
    const group = screen.getByRole("group", { name: "Traffic scope" });
    const buttons = within(group).getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0].textContent).toBe("Humans");
    expect(buttons[0].getAttribute("aria-pressed")).toBe("false");
    expect(buttons[1].textContent).toBe("All");
    expect(buttons[1].getAttribute("aria-pressed")).toBe("true");
  });

  it("renders the meta node", () => {
    setup();
    expect(screen.getByText("META-NODE")).toBeTruthy();
  });
});
