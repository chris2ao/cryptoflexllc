import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./project-card";

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children }: any) => <span data-testid="badge">{children}</span>,
}));

describe("ProjectCard", () => {
  const mockProject = {
    title: "Test Project",
    description: "This is a test project description",
    tech: ["React", "TypeScript", "Vitest"],
  };

  it("renders title and description", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Test Project"
    );
    expect(
      screen.getByText("This is a test project description")
    ).toBeInTheDocument();
  });

  it("renders tech badges", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Vitest")).toBeInTheDocument();
    expect(screen.getAllByTestId("badge")).toHaveLength(3);
  });

  it("wraps in link when project.link is provided", () => {
    const projectWithLink = {
      ...mockProject,
      link: "https://example.com",
    };
    render(<ProjectCard project={projectWithLink} />);

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "https://example.com");
    expect(linkElement).toHaveAttribute("target", "_blank");
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders as div when no link is provided", () => {
    const { container } = render(<ProjectCard project={mockProject} />);

    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.tagName).toBe("DIV");
    expect(outerDiv).not.toHaveAttribute("href");
  });

  it("applies group class for hover effects", () => {
    const projectWithLink = {
      ...mockProject,
      link: "https://example.com",
    };
    const { container } = render(<ProjectCard project={projectWithLink} />);

    const linkElement = container.firstChild as HTMLElement;
    expect(linkElement.className).toContain("group");
  });
});
