import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./hero";

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, asChild, ...props }: any) => {
    if (asChild) return <>{children}</>;
    return <button {...props}>{children}</button>;
  },
}));

describe("Hero", () => {
  it("renders heading with Chris Johnson name", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Chris Johnson/
    );
  });

  it("has blog CTA link", () => {
    render(<Hero />);
    const blogLink = screen.getByText("Read the Blog");
    expect(blogLink.closest("a")).toHaveAttribute("href", "/blog");
  });

  it("has about CTA link", () => {
    render(<Hero />);
    const aboutLink = screen.getByText("About Me");
    expect(aboutLink.closest("a")).toHaveAttribute("href", "/about");
  });

  it("renders portrait image", () => {
    render(<Hero />);
    const portrait = screen.getByAltText("Chris Johnson");
    expect(portrait).toBeInTheDocument();
  });

  it("renders company name", () => {
    render(<Hero />);
    expect(screen.getByText("CryptoFlex LLC")).toBeInTheDocument();
  });

  it("renders professional description", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Veteran turned cybersecurity professional/)
    ).toBeInTheDocument();
  });
});
