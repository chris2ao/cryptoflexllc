import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  vi,
} from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { NewsletterPopup } from "./NewsletterPopup";
import { SUBSCRIBE_COPY } from "@/lib/subscribe-copy";

let mockPathname = "/blog";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

let mockStatus = "idle";
vi.mock("@/hooks/use-subscribe", () => ({
  useSubscribe: () => ({
    email: "",
    status: mockStatus,
    message: "",
    handleSubmit: vi.fn(),
    updateEmail: vi.fn(),
    subscriberCount: null,
  }),
}));

const DISMISSED_KEY = "cf_newsletter_dismissed_at";
const SUBSCRIBED_KEY = "cf_newsletter_subscribed";
const DAY_MS = 24 * 60 * 60 * 1000;

// Node 22+ ships an experimental global `localStorage` that is undefined
// without --localstorage-file and shadows jsdom's. Use a deterministic stub.
function createStorageStub(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => [...store.keys()][index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  } as Storage;
}

const storageStub = createStorageStub();

const DEEP = 1700; // (1700 + 800) / 4000 = 62.5%
const SHALLOW = 400; // (400 + 800) / 4000 = 30%

function scrollTo(y: number) {
  setScroll(y);
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

function popupHeading() {
  return screen.queryByText(SUBSCRIBE_COPY.title);
}

beforeAll(() => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: storageStub,
  });
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: storageStub,
  });

  // jsdom versions without <dialog> method support
  const proto = window.HTMLDialogElement?.prototype;
  if (proto && typeof proto.show !== "function") {
    proto.show = function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
  }
  if (proto && typeof proto.showModal !== "function") {
    proto.showModal = function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
    proto.close = function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    };
  }
});

function setViewport(mobile: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: mobile && query.includes("max-width"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
}

function setScroll(scrollY: number, innerHeight = 800, docHeight = 4000) {
  Object.defineProperty(window, "scrollY", { configurable: true, value: scrollY });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: innerHeight });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: docHeight,
  });
}

beforeEach(() => {
  mockPathname = "/";
  mockStatus = "idle";
  setViewport(false);
  setScroll(0);
  vi.useFakeTimers();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("NewsletterPopup", () => {
  it("shows after a scroll event at 60% depth on the home route (desktop)", () => {
    mockPathname = "/";
    render(<NewsletterPopup />);
    expect(popupHeading()).not.toBeInTheDocument();
    scrollTo(DEEP);
    expect(popupHeading()).toBeInTheDocument();
  });

  it("shows after a scroll event at 60% depth on a post route (mobile)", () => {
    setViewport(true);
    mockPathname = "/blog/some-post";
    render(<NewsletterPopup />);
    scrollTo(DEEP);
    expect(popupHeading()).toBeInTheDocument();
  });

  it("uses the shared subscribe copy", () => {
    render(<NewsletterPopup />);
    scrollTo(DEEP);
    expect(screen.getByText(SUBSCRIBE_COPY.body)).toBeInTheDocument();
    expect(screen.queryByText("Stay in the Loop")).not.toBeInTheDocument();
  });

  it("shows the shared success copy after subscribing", () => {
    const { rerender } = render(<NewsletterPopup />);
    scrollTo(DEEP);
    mockStatus = "success";
    rerender(<NewsletterPopup />);
    expect(screen.getByText(SUBSCRIBE_COPY.success)).toBeInTheDocument();
  });

  it("does not show on a scroll event at 30% depth", () => {
    render(<NewsletterPopup />);
    scrollTo(SHALLOW);
    expect(popupHeading()).not.toBeInTheDocument();
  });

  it("does not show on mount or over time, even if depth is already 1", () => {
    setScroll(3200); // 100%
    render(<NewsletterPopup />);
    expect(popupHeading()).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(popupHeading()).not.toBeInTheDocument();
  });

  it("stays suppressed within 7 days of dismissal", () => {
    localStorage.setItem(
      DISMISSED_KEY,
      new Date(Date.now() - 6 * DAY_MS).toISOString()
    );
    render(<NewsletterPopup />);
    scrollTo(DEEP);
    expect(popupHeading()).not.toBeInTheDocument();
  });

  it("shows again when the dismissal is older than 7 days", () => {
    localStorage.setItem(
      DISMISSED_KEY,
      new Date(Date.now() - 8 * DAY_MS).toISOString()
    );
    render(<NewsletterPopup />);
    scrollTo(DEEP);
    expect(popupHeading()).toBeInTheDocument();
  });

  it("never shows for subscribed users", () => {
    localStorage.setItem(SUBSCRIBED_KEY, new Date().toISOString());
    render(<NewsletterPopup />);
    scrollTo(DEEP);
    expect(popupHeading()).not.toBeInTheDocument();
  });

  it("does not show on excluded routes", () => {
    mockPathname = "/analytics";
    render(<NewsletterPopup />);
    scrollTo(DEEP);
    expect(popupHeading()).not.toBeInTheDocument();
  });

  it("re-checks suppression at reveal time", () => {
    render(<NewsletterPopup />);
    localStorage.setItem(DISMISSED_KEY, new Date().toISOString());
    scrollTo(DEEP);
    expect(popupHeading()).not.toBeInTheDocument();
  });

  it("removes its scroll listener on unmount", () => {
    const { unmount } = render(<NewsletterPopup />);
    const removeSpy = vi.spyOn(window, "removeEventListener");
    unmount();
    expect(removeSpy.mock.calls.map((c) => c[0])).toContain("scroll");
    removeSpy.mockRestore();
  });

  it("removes its scroll listener after reveal", () => {
    render(<NewsletterPopup />);
    const removeSpy = vi.spyOn(window, "removeEventListener");
    scrollTo(DEEP);
    expect(removeSpy.mock.calls.map((c) => c[0])).toContain("scroll");
    removeSpy.mockRestore();
  });

  it("desktop modal: a native cancel event (Escape) writes the dismissal", () => {
    render(<NewsletterPopup />);
    scrollTo(DEEP);
    expect(popupHeading()).toBeInTheDocument();
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    act(() => {
      dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
    });
    expect(popupHeading()).not.toBeInTheDocument();
    expect(localStorage.getItem(DISMISSED_KEY)).not.toBeNull();
  });

  it("close button writes the dismissal", () => {
    render(<NewsletterPopup />);
    scrollTo(DEEP);
    fireEvent.click(
      screen.getByRole("button", { name: /close newsletter popup/i })
    );
    expect(popupHeading()).not.toBeInTheDocument();
    expect(localStorage.getItem(DISMISSED_KEY)).not.toBeNull();
  });

  describe("mobile viewport", () => {
    beforeEach(() => setViewport(true));

    it("ignores Escape that was already handled (defaultPrevented)", () => {
      render(<NewsletterPopup />);
      scrollTo(DEEP);
      const handled = (e: KeyboardEvent) => e.preventDefault();
      // A handler lower in the tree (like a dialog) runs before document's
      document.body.addEventListener("keydown", handled);
      act(() => {
        document.body.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Escape",
            cancelable: true,
            bubbles: true,
          }),
        );
      });
      document.body.removeEventListener("keydown", handled);
      expect(popupHeading()).toBeInTheDocument();
      expect(localStorage.getItem(DISMISSED_KEY)).toBeNull();
    });

    it("ignores Escape while a Radix sheet or other dialog is open", () => {
      render(<NewsletterPopup />);
      scrollTo(DEEP);
      const sheet = document.createElement("div");
      sheet.setAttribute("role", "dialog");
      sheet.setAttribute("data-state", "open");
      document.body.appendChild(sheet);
      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });
      expect(popupHeading()).toBeInTheDocument();
      expect(localStorage.getItem(DISMISSED_KEY)).toBeNull();
      sheet.remove();
    });

    it("opens non-modal with show(), not showModal()", () => {
      const proto = window.HTMLDialogElement.prototype;
      const show = vi.fn(function (this: HTMLDialogElement) {
        this.setAttribute("open", "");
      });
      const showModal = vi.fn(function (this: HTMLDialogElement) {
        this.setAttribute("open", "");
      });
      const origShow = proto.show;
      const origModal = proto.showModal;
      proto.show = show;
      proto.showModal = showModal;
      try {
        render(<NewsletterPopup />);
        scrollTo(DEEP);
        expect(popupHeading()).toBeInTheDocument();
        expect(show).toHaveBeenCalledTimes(1);
        expect(showModal).not.toHaveBeenCalled();
      } finally {
        proto.show = origShow;
        proto.showModal = origModal;
      }
    });

    it("closes on Escape while non-modal", () => {
      render(<NewsletterPopup />);
      scrollTo(DEEP);
      expect(popupHeading()).toBeInTheDocument();
      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });
      expect(popupHeading()).not.toBeInTheDocument();
      expect(localStorage.getItem(DISMISSED_KEY)).not.toBeNull();
    });
  });

  it("desktop opens modal with showModal(), not show()", () => {
    const proto = window.HTMLDialogElement.prototype;
    const show = vi.fn();
    const showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    });
    const origShow = proto.show;
    const origModal = proto.showModal;
    proto.show = show;
    proto.showModal = showModal;
    try {
      render(<NewsletterPopup />);
      scrollTo(DEEP);
      expect(showModal).toHaveBeenCalledTimes(1);
      expect(show).not.toHaveBeenCalled();
    } finally {
      proto.show = origShow;
      proto.showModal = origModal;
    }
  });
});
