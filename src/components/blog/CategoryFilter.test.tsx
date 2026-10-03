import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryFilter, MOBILE_VISIBLE_CATEGORIES } from "./CategoryFilter";

const many = ["All", ...Array.from({ length: 40 }, (_, i) => `Topic ${i + 1}`)];

function chip(name: string) {
  return screen.getByRole("link", { name });
}

describe("CategoryFilter", () => {
  it("keeps every category link in the markup", () => {
    render(<CategoryFilter categories={many} activeCategory={null} />);
    expect(screen.getAllByRole("link")).toHaveLength(many.length);
  });

  it("hides categories past the mobile limit on small screens only", () => {
    render(<CategoryFilter categories={many} activeCategory={null} />);
    expect(chip(many[MOBILE_VISIBLE_CATEGORIES - 1]).className).not.toContain("max-sm:hidden");
    expect(chip(many[MOBILE_VISIBLE_CATEGORIES]).className).toContain("max-sm:hidden");
  });

  it("never hides the active category", () => {
    render(<CategoryFilter categories={many} activeCategory="Topic 40" />);
    expect(chip("Topic 40").className).not.toContain("max-sm:hidden");
  });

  it("reveals all categories when the toggle is pressed", () => {
    render(<CategoryFilter categories={many} activeCategory={null} />);
    const toggle = screen.getByRole("button", { name: /show all 40 topics/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(chip("Topic 40").className).not.toContain("max-sm:hidden");
    expect(screen.getByRole("button", { name: /show fewer topics/i })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("renders no toggle when everything fits", () => {
    render(<CategoryFilter categories={["All", "Security", "AI"]} activeCategory={null} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("gives chips a 36px minimum height on touch screens", () => {
    render(<CategoryFilter categories={["All", "Security"]} activeCategory={null} />);
    expect(chip("Security").className).toContain("[@media(pointer:coarse)]:min-h-9");
  });
});
