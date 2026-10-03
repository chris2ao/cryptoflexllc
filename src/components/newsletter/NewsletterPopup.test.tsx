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

let mockPathname = "/blog";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

vi.mock("@/hooks/use-subscribe", () => ({
  useSubscribe: () => ({
    email: "",
    status: "idle",
    message: "",
    handleSubmit: vi.fn(),
    updateEmail: vi.fn(),
    subscriberCount: null,
  }),
}));

const DISMISSED_KEY = "cf_newsletter_dismissed_at";
const SUBSCRIBED_KEY = "cf_newsletter_subscribed";
const DELAY_MS = 20_000;
const DAY_MS = 24 * 60 * 60 * 1000;

let documentHidden = false;

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

function setTabHidden(hidden: boolean) {
  documentHidden = hidden;
  act(() => {
    document.dispatchEvent(new Event("visibilitychange"));
  });
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function popupHeading() {
  return screen.queryByText("Stay in the Loop");
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

  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => documentHidden,
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
  mockPathname = "/blog";
  setViewport(false);
  setScroll(0);
  vi.useFakeTimers();
  localStorage.clear();
  documentHidden = false;
});

afterEach(() => {
  vi.useRealTimers();
});

describe("NewsletterPopup", () => {
  it("shows after 20 seconds of visible time", () => {
    render(<NewsletterPopup />);

    expect(popupHeading()).not.toBeInTheDocument();
    advance(DELAY_MS);
    expect(popupHeading()).toBeInTheDocument();
  });

  it("pauses the countdown while the tab is hidden", () => {
    render(<NewsletterPopup />);

    advance(10_000);
    setTabHidden(true);
    advance(60_000);
    setTabHidden(false);

    advance(9_000);
    expect(popupHeading()).not.toBeInTheDocument();

    advance(1_000);
    expect(popupHeading()).toBeInTheDocument();
  });

  it("does not re-show after dismissal when the tab is hidden and shown again", () => {
    render(<NewsletterPopup />);

    advance(DELAY_MS);
    expect(popupHeading()).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /close newsletter popup/i })
    );
    expect(popupHeading()).not.toBeInTheDocument();

    setTabHidden(true);
    setTabHidden(false);
    advance(DELAY_MS);

    expect(popupHeading()).not.toBeInTheDocument();
  });

  it("re-checks suppression at fire time (subscribe via another form mid-countdown)", () => {
    render(<NewsletterPopup />);

    advance(10_000);
    localStorage.setItem(SUBSCRIBED_KEY, new Date().toISOString());
    advance(10_000);

    expect(popupHeading()).not.toBeInTheDocument();
  });

  it("stays suppressed when dismissed less than 7 days ago", () => {
    localStorage.setItem(
      DISMISSED_KEY,
      new Date(Date.now() - 6 * DAY_MS).toISOString()
    );

    render(<NewsletterPopup />);
    advance(DELAY_MS);

    expect(popupHeading()).not.toBeInTheDocument();
  });

  it("shows again when the dismissal is older than 7 days", () => {
    localStorage.setItem(
      DISMISSED_KEY,
      new Date(Date.now() - 8 * DAY_MS).toISOString()
    );

    render(<NewsletterPopup />);
    advance(DELAY_MS);

    expect(popupHeading()).toBeInTheDocument();
  });

  it("never shows for subscribed users, including across tab switches", () => {
    localStorage.setItem(SUBSCRIBED_KEY, new Date().toISOString());

    render(<NewsletterPopup />);
    advance(DELAY_MS);
    setTabHidden(true);
    setTabHidden(false);
    advance(DELAY_MS);

    expect(popupHeading()).not.toBeInTheDocument();
  });

  it("desktop modal: a native cancel event (Escape) writes the dismissal", () => {
    render(<NewsletterPopup />);
    advance(DELAY_MS);
    expect(popupHeading()).toBeInTheDocument();
    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    act(() => {
      dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
    });
    expect(popupHeading()).not.toBeInTheDocument();
    expect(localStorage.getItem(DISMISSED_KEY)).not.toBeNull();
  });

  it("removes its scroll listener on unmount", () => {
    setViewport(true);
    mockPathname = "/blog/some-post";
    const { unmount } = render(<NewsletterPopup />);
    advance(DELAY_MS);
    const removeSpy = vi.spyOn(window, "removeEventListener");
    unmount();
    expect(removeSpy.mock.calls.map((c) => c[0])).toContain("scroll");
    removeSpy.mockRestore();
  });

  it("a dismissal during the scroll wait suppresses the later reveal", () => {
    setViewport(true);
    mockPathname = "/blog/some-post";
    render(<NewsletterPopup />);
    advance(DELAY_MS);
    expect(popupHeading()).not.toBeInTheDocument();
    // Dismissed elsewhere (another tab or form) while waiting for depth
    localStorage.setItem(DISMISSED_KEY, new Date().toISOString());
    setScroll(1700);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(popupHeading()).not.toBeInTheDocument();
  });

  describe("mobile viewport", () => {
    it("ignores Escape that was already handled (defaultPrevented)", () => {
      setViewport(true);
      render(<NewsletterPopup />);
      advance(DELAY_MS);
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
      setViewport(true);
      render(<NewsletterPopup />);
      advance(DELAY_MS);
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
      setViewport(true);
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
        advance(DELAY_MS);
        expect(popupHeading()).toBeInTheDocument();
        expect(show).toHaveBeenCalledTimes(1);
        expect(showModal).not.toHaveBeenCalled();
      } finally {
        proto.show = origShow;
        proto.showModal = origModal;
      }
    });

    it("closes on Escape while non-modal", () => {
      setViewport(true);
      render(<NewsletterPopup />);
      advance(DELAY_MS);
      expect(popupHeading()).toBeInTheDocument();
      act(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });
      expect(popupHeading()).not.toBeInTheDocument();
      expect(localStorage.getItem(DISMISSED_KEY)).not.toBeNull();
    });

    it("on a post route waits for 60% scroll depth after the 20s delay", () => {
      setViewport(true);
      mockPathname = "/blog/some-post";
      render(<NewsletterPopup />);
      advance(DELAY_MS);
      expect(popupHeading()).not.toBeInTheDocument();

      setScroll(1000); // (1000 + 800) / 4000 = 45%
      act(() => {
        window.dispatchEvent(new Event("scroll"));
      });
      expect(popupHeading()).not.toBeInTheDocument();

      setScroll(1700); // 62.5%
      act(() => {
        window.dispatchEvent(new Event("scroll"));
      });
      expect(popupHeading()).toBeInTheDocument();
    });

    it("on a post route does not show on depth alone before 20s", () => {
      setViewport(true);
      mockPathname = "/blog/some-post";
      setScroll(3000);
      render(<NewsletterPopup />);
      act(() => {
        window.dispatchEvent(new Event("scroll"));
      });
      expect(popupHeading()).not.toBeInTheDocument();
      advance(DELAY_MS);
      expect(popupHeading()).toBeInTheDocument();
    });

    it("does not apply the scroll gate on the /blog index", () => {
      setViewport(true);
      mockPathname = "/blog";
      render(<NewsletterPopup />);
      advance(DELAY_MS);
      expect(popupHeading()).toBeInTheDocument();
    });

    it("does not apply the scroll gate on desktop post routes", () => {
      setViewport(false);
      mockPathname = "/blog/some-post";
      render(<NewsletterPopup />);
      advance(DELAY_MS);
      expect(popupHeading()).toBeInTheDocument();
    });
  });
});
