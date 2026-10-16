import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThirdConflictPromo } from "./third-conflict-promo";

vi.mock("@/hooks/use-typing-animation", () => ({
  useTypingAnimation: (text: string) => text,
}));

describe("ThirdConflictPromo", () => {
  it("shows the verified stat chips", () => {
    const { container } = render(<ThirdConflictPromo />);
    const text = container.textContent ?? "";
    expect(text).toContain("7 Unit Types");
    expect(text).toContain("14 Random Events");
    expect(text).toContain("5 Difficulty Levels");
  });

  it("links to the game setup", () => {
    render(<ThirdConflictPromo />);
    expect(screen.getByRole("link", { name: "Play Now" })).toHaveAttribute(
      "href",
      "https://third-conflict.vercel.app/game/setup"
    );
  });

  it("contains no em dash", () => {
    const { container } = render(<ThirdConflictPromo />);
    expect(container.textContent).not.toContain("\u2014");
  });
});
