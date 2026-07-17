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

vi.mock("next/navigation", () => ({
  usePathname: () => "/blog",
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
  if (proto && typeof proto.showModal !== "function") {
    proto.showModal = function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
    proto.close = function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    };
  }
});

beforeEach(() => {
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
});
