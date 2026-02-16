import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SlideCarousel } from "./slide-carousel";
import type { SlideData } from "./slide-carousel";

vi.mock("next/font/google", () => ({
  Syne: () => ({ variable: "--font-syne" }),
  JetBrains_Mono: () => ({ variable: "--font-jetbrains-mono" }),
  Outfit: () => ({ variable: "--font-outfit" }),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

const testSlides: SlideData[] = [
  { id: "slide-1", content: <div>Slide One</div> },
  { id: "slide-2", content: <div>Slide Two</div> },
  { id: "slide-3", content: <div>Slide Three</div> },
];

describe("SlideCarousel", () => {
  it("renders the first slide content", () => {
    render(<SlideCarousel slides={testSlides} />);
    expect(screen.getByText("Slide One")).toBeInTheDocument();
  });

  it("shows correct slide counter", () => {
    render(<SlideCarousel slides={testSlides} />);
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("navigates to next slide on next button click", () => {
    render(<SlideCarousel slides={testSlides} />);
    fireEvent.click(screen.getByLabelText("Next slide"));
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("navigates to previous slide on prev button click", () => {
    render(<SlideCarousel slides={testSlides} />);
    fireEvent.click(screen.getByLabelText("Next slide"));
    fireEvent.click(screen.getByLabelText("Previous slide"));
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("disables prev button on first slide", () => {
    render(<SlideCarousel slides={testSlides} />);
    expect(screen.getByLabelText("Previous slide")).toBeDisabled();
  });

  it("disables next button on last slide", () => {
    render(<SlideCarousel slides={testSlides} />);
    fireEvent.click(screen.getByLabelText("Next slide"));
    fireEvent.click(screen.getByLabelText("Next slide"));
    expect(screen.getByLabelText("Next slide")).toBeDisabled();
  });

  it("navigates with keyboard ArrowRight", () => {
    render(<SlideCarousel slides={testSlides} />);
    const carousel = screen.getByRole("region");
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("navigates with keyboard ArrowLeft", () => {
    render(<SlideCarousel slides={testSlides} />);
    const carousel = screen.getByRole("region");
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    fireEvent.keyDown(carousel, { key: "ArrowLeft" });
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("applies the slide-carousel-theme class", () => {
    render(<SlideCarousel slides={testSlides} />);
    const carousel = screen.getByRole("region");
    expect(carousel.className).toContain("slide-carousel-theme");
  });
});
