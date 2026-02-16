import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: () => <hr />,
}));

describe("Footer", () => {
  it("renders company name and description", () => {
    render(<Footer />);
    expect(screen.getByAltText("CryptoFlex LLC")).toBeInTheDocument();
    expect(
      screen.getByText(/Tech blog and IT consulting based in Florida/)
    ).toBeInTheDocument();
  });

  it("has all 6 navigation links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/blog"
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about"
    );
    expect(screen.getByRole("link", { name: "Portfolio" })).toHaveAttribute(
      "href",
      "/portfolio"
    );
    expect(screen.getByRole("link", { name: "Resources" })).toHaveAttribute(
      "href",
      "/resources"
    );
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute(
      "href",
      "/services"
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("has LinkedIn external link", () => {
    render(<Footer />);
    const linkedInLink = screen.getByRole("link", { name: "LinkedIn" });
    expect(linkedInLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/chris-johnson-secops/"
    );
    expect(linkedInLink).toHaveAttribute("target", "_blank");
    expect(linkedInLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("has GitHub external link", () => {
    render(<Footer />);
    const githubLink = screen.getByRole("link", { name: "GitHub" });
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/chris2ao"
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows current year in copyright", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(
        new RegExp(`© ${currentYear} CryptoFlex LLC\\. All rights reserved\\.`)
      )
    ).toBeInTheDocument();
  });
});
