import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthorCard } from "./AuthorCard";
import { IDENTITY_LINE } from "@/lib/identity";

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));
vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe("AuthorCard", () => {
  it("renders the title", () => {
    render(<AuthorCard />);
    expect(screen.getByText("Security Engineer · Builder")).toBeInTheDocument();
  });

  it("opens the bio with the identity line", () => {
    const { container } = render(<AuthorCard />);
    const bio = container.querySelector("p.font-body")!;
    expect(bio.textContent?.startsWith(IDENTITY_LINE)).toBe(true);
    expect(bio.textContent).not.toContain(String.fromCharCode(8212));
  });

  it("keeps the LinkedIn and GitHub links", () => {
    render(<AuthorCard />);
    expect(screen.getByLabelText("LinkedIn")).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/chris-johnson-secops/"
    );
    expect(screen.getByLabelText("GitHub")).toHaveAttribute(
      "href",
      "https://github.com/chris2ao"
    );
  });
});
