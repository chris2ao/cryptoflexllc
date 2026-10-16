import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArcadeSection } from "./arcade-section";

vi.mock("@/hooks/use-typing-animation", () => ({
  useTypingAnimation: (text: string) => text,
}));

describe("ArcadeSection", () => {
  it("renders the section label with the passed index", () => {
    const { container } = render(<ArcadeSection index={4} />);
    expect(container.querySelector(".ed-section-label")?.textContent).toBe(
      "§ 04 / The Arcade"
    );
  });

  it("renders both promos with play links", () => {
    render(<ArcadeSection index={4} />);
    const links = screen.getAllByRole("link", { name: "Play Now" });
    expect(links).toHaveLength(2);
  });

  it("contains no em dash", () => {
    const { container } = render(<ArcadeSection index={4} />);
    expect(container.textContent).not.toContain("\u2014");
  });
});
