import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IpLink, VISITOR_EVENT } from "./ip-link";

afterEach(() => vi.restoreAllMocks());

describe("IpLink", () => {
  it("dispatches the visitor event with the ip on click", () => {
    const seen: unknown[] = [];
    const handler = (e: Event) => seen.push((e as CustomEvent).detail);
    window.addEventListener(VISITOR_EVENT, handler);
    render(<IpLink ip="8.8.8.8" />);
    fireEvent.click(screen.getByRole("button"));
    window.removeEventListener(VISITOR_EVENT, handler);
    expect(seen).toEqual([{ ip: "8.8.8.8" }]);
  });

  it("renders unknown for an empty ip", () => {
    render(<IpLink ip="" />);
    expect(screen.getByText("unknown")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
