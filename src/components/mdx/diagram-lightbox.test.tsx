import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DiagramLightbox } from "./diagram-lightbox";

function renderBox() {
  return render(
    <DiagramLightbox caption="Pipeline">
      <svg viewBox="0 0 900 400" data-testid="diagram" />
    </DiagramLightbox>,
  );
}

describe("DiagramLightbox", () => {
  it("has one tab stop: the open button, inside the scroll area, with an inset focus ring", () => {
    const { container } = renderBox();
    const region = container.querySelector(".diagram-scroll")!;
    const btn = screen.getByRole("button", { name: /Enlarge diagram: Pipeline/ });
    expect(region.contains(btn)).toBe(true);
    expect(btn.className).toContain("diagram-scroll-inner");
    expect(btn.className).toContain("focus-visible:-outline-offset-2");
    expect(container.querySelectorAll("[tabindex]").length).toBe(0);
    expect(container.querySelectorAll("button").length).toBe(1);
  });

  it("shows touch and mouse hint wording", () => {
    const { container } = renderBox();
    expect(container.querySelector(".diagram-badge-touch")?.textContent).toBe(
      "Tap to enlarge",
    );
    expect(container.querySelector(".diagram-hint")?.textContent).toContain(
      "Tap to enlarge",
    );
  });

  it("opens a dialog with 44px controls and pinch-zoom touch action", () => {
    renderBox();
    fireEvent.click(screen.getByRole("button", { name: /Enlarge diagram/ }));
    const dialog = screen.getByRole("dialog");
    const close = screen.getByRole("button", { name: "Close" });
    expect(close.className).toContain("min-h-11");
    expect(close.className).toContain("min-w-11");
    expect(dialog.innerHTML).toContain("pinch-zoom");
    expect(dialog.querySelector(".diagram-modal-content")).toBeTruthy();
    expect(screen.getByText("100%")).toBeTruthy();
    fireEvent.click(close);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes the dialog on Escape", () => {
    renderBox();
    fireEvent.click(screen.getByRole("button", { name: /Enlarge diagram/ }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("uses no em dashes in UI text", () => {
    const { container } = renderBox();
    expect(container.textContent).not.toContain("\u2014");
  });
});
