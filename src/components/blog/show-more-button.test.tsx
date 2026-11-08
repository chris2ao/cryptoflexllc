import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ShowMoreButton } from "./show-more-button";

const base = {
  mobileShown: 12,
  desktopShown: 24,
  total: 30,
  hasMoreMobile: true,
  hasMoreDesktop: true,
  onClick: () => {},
};

describe("ShowMoreButton", () => {
  it("renders both counts and calls onClick", () => {
    const onClick = vi.fn();
    render(<ShowMoreButton {...base} onClick={onClick} />);
    expect(screen.getByText("(12 of 30 shown)")).toBeInTheDocument();
    expect(screen.getByText("(24 of 30 shown)")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("hides the wrapper at sm when only mobile has more", () => {
    const { container } = render(
      <ShowMoreButton {...base} hasMoreDesktop={false} />
    );
    expect((container.firstChild as HTMLElement).className).toBe("mt-6 sm:hidden");
  });

  it("uses the plain wrapper when desktop has more", () => {
    const { container } = render(<ShowMoreButton {...base} />);
    expect((container.firstChild as HTMLElement).className).toBe("mt-6");
  });

  it("renders nothing when nothing is left or the list is empty", () => {
    const none = render(
      <ShowMoreButton {...base} hasMoreMobile={false} hasMoreDesktop={false} />
    );
    expect(none.container).toBeEmptyDOMElement();
    const empty = render(<ShowMoreButton {...base} total={0} />);
    expect(empty.container).toBeEmptyDOMElement();
  });
});
