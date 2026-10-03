import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { CommandPalette } from "./CommandPalette";
import { openCommandPalette, OPEN_COMMAND_PALETTE_EVENT } from "./open-command-palette";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

beforeAll(() => {
  // jsdom lacks the <dialog> modal API
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

describe("CommandPalette", () => {
  it("opens when openCommandPalette() is called", () => {
    render(<CommandPalette posts={[]} />);
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    expect(dialog.open).toBe(false);
    act(() => {
      openCommandPalette();
    });
    expect(dialog.open).toBe(true);
    expect(screen.getByRole("combobox", { name: "Search" })).toBeInTheDocument();
  });

  it("removes its open-event listener on unmount", () => {
    const { unmount } = render(<CommandPalette posts={[]} />);
    const removeSpy = vi.spyOn(window, "removeEventListener");
    unmount();
    expect(removeSpy.mock.calls.map((c) => c[0])).toContain(
      OPEN_COMMAND_PALETTE_EVENT,
    );
    removeSpy.mockRestore();
    const addSpy = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    act(() => {
      openCommandPalette();
    });
    expect(addSpy).not.toHaveBeenCalled();
    addSpy.mockRestore();
  });

  it("restores focus to the masthead search button when the opener is gone", () => {
    render(
      <>
        <button className="masthead-search-btn">Search posts</button>
        <CommandPalette posts={[]} />
      </>,
    );
    const btn = document.querySelector(".masthead-search-btn") as HTMLElement;
    // jsdom has no layout, so report the button as rendered
    btn.getClientRects = () => [{}] as unknown as DOMRectList;
    act(() => {
      openCommandPalette();
    });
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    act(() => {
      dialog.close();
    });
    expect(document.activeElement).toBe(btn);
  });

  it("uses a 16px-on-mobile input", () => {
    render(<CommandPalette posts={[]} />);
    expect(screen.getByRole("combobox", { name: "Search", hidden: true }).className).toContain("text-base");
  });
});
