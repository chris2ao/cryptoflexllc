import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { PostPerformanceTable } from "./post-performance-table";
import type { PostPerformanceRow } from "@/lib/analytics-queries/posts";

function row(overrides: Partial<PostPerformanceRow>): PostPerformanceRow {
  return {
    page_path: "/blog/a",
    title: "Post A",
    views: 10,
    readers: 5,
    read_through_pct: 40,
    median_seconds: 65,
    subscribes: 1,
    comments: 2,
    ...overrides,
  };
}

const rows = [
  row({ page_path: "/blog/a", title: "Post A", views: 10, readers: 9, read_through_pct: 12.34, median_seconds: 65 }),
  row({ page_path: "/blog/b", title: "Post B", views: 50, readers: 2, read_through_pct: 80, median_seconds: 5 }),
  row({ page_path: "https://evil.example/x", title: "Post C", views: 30, readers: 4, read_through_pct: 50, median_seconds: 600 }),
];

function titles() {
  return screen
    .getAllByRole("row")
    .slice(1)
    .map((r) => within(r).getAllByRole("cell")[0].textContent);
}

describe("PostPerformanceTable", () => {
  it("defaults to views descending", () => {
    render(<PostPerformanceTable rows={rows} />);
    expect(titles()).toEqual(["Post B", "Post C", "Post A"]);
    expect(
      screen.getByRole("columnheader", { name: /views/i }).getAttribute("aria-sort")
    ).toBe("descending");
  });

  it("sorts by readers when the header is clicked, then toggles direction", () => {
    render(<PostPerformanceTable rows={rows} />);
    fireEvent.click(screen.getByRole("columnheader", { name: /readers/i }));
    expect(titles()).toEqual(["Post A", "Post C", "Post B"]);
    fireEvent.click(screen.getByRole("columnheader", { name: /readers/i }));
    expect(titles()).toEqual(["Post B", "Post C", "Post A"]);
  });

  it("activates sorting from the keyboard", () => {
    render(<PostPerformanceTable rows={rows} />);
    const th = screen.getByRole("columnheader", { name: /median read/i });
    fireEvent.keyDown(th, { key: "Enter" });
    expect(titles()).toEqual(["Post C", "Post A", "Post B"]);
    fireEvent.keyDown(th, { key: " " });
    expect(titles()).toEqual(["Post B", "Post A", "Post C"]);
    expect(th.getAttribute("aria-sort")).toBe("ascending");
  });

  it("links only internal single-slash paths", () => {
    render(<PostPerformanceTable rows={rows} />);
    expect(screen.getByRole("link", { name: "Post A" }).getAttribute("href")).toBe("/blog/a");
    expect(screen.queryByRole("link", { name: "Post C" })).toBeNull();
  });

  it("formats median as m:ss and read-through with one decimal", () => {
    render(<PostPerformanceTable rows={rows} />);
    expect(screen.getByText("1:05")).toBeTruthy();
    expect(screen.getByText("0:05")).toBeTruthy();
    expect(screen.getByText("10:00")).toBeTruthy();
    expect(screen.getByText("12.3%")).toBeTruthy();
  });

  it("renders the empty state", () => {
    render(<PostPerformanceTable rows={[]} />);
    expect(screen.getByText("No posts in range")).toBeTruthy();
  });
});
