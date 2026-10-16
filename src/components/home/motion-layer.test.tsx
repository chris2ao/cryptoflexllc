import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { render } from "@testing-library/react";
import { MotionLayer } from "./motion-layer";

type ObserverRecord = {
  callback: IntersectionObserverCallback;
  observed: Element[];
  disconnect: Mock<() => void>;
};

let observers: ObserverRecord[] = [];

class FakeIntersectionObserver {
  private record: ObserverRecord;

  constructor(callback: IntersectionObserverCallback) {
    this.record = { callback, observed: [], disconnect: vi.fn<() => void>() };
    observers.push(this.record);
  }

  observe(el: Element) {
    this.record.observed.push(el);
  }

  unobserve = vi.fn();

  disconnect() {
    this.record.disconnect();
  }
}

function setReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: reduce && query.includes("reduce"),
      media: query,
    }))
  );
}

function intersect(record: ObserverRecord, target: Element, isIntersecting: boolean) {
  record.callback(
    [{ target, isIntersecting } as IntersectionObserverEntry],
    {} as IntersectionObserver
  );
}

function mountPage() {
  document.body.innerHTML = `
    <section class="ed-section">
      <div class="ed-paths">
        <a class="ed-path reveal"></a>
        <a class="ed-path reveal"></a>
        <a class="ed-path reveal"></a>
      </div>
    </section>`;
}

beforeEach(() => {
  observers = [];
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  mountPage();
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("MotionLayer", () => {
  it("does nothing when the reader prefers reduced motion", () => {
    setReducedMotion(true);
    render(<MotionLayer />);
    expect(observers).toHaveLength(0);
    const first = document.querySelector<HTMLElement>(".ed-path")!;
    expect(first.style.getPropertyValue("--stagger")).toBe("");
  });

  it("staggers cards through the --stagger custom property", () => {
    setReducedMotion(false);
    render(<MotionLayer />);
    const delays = Array.from(document.querySelectorAll<HTMLElement>(".ed-path")).map((el) =>
      el.style.getPropertyValue("--stagger")
    );
    expect(delays).toEqual(["0ms", "60ms", "120ms"]);
  });

  it("never sets an inline transition-delay that would slow hover states", () => {
    setReducedMotion(false);
    render(<MotionLayer />);
    for (const el of document.querySelectorAll<HTMLElement>(".ed-path")) {
      expect(el.style.transitionDelay).toBe("");
    }
  });

  it("reveals an element once it intersects", () => {
    setReducedMotion(false);
    render(<MotionLayer />);
    const [reveal] = observers;
    const card = document.querySelector(".ed-path")!;

    intersect(reveal, card, false);
    expect(card.classList.contains("in")).toBe(false);

    intersect(reveal, card, true);
    expect(card.classList.contains("in")).toBe(true);
  });

  it("toggles the section state in both directions", () => {
    setReducedMotion(false);
    render(<MotionLayer />);
    const section = observers[1];
    const el = document.querySelector(".ed-section")!;

    intersect(section, el, true);
    expect(el.classList.contains("in")).toBe(true);
    intersect(section, el, false);
    expect(el.classList.contains("in")).toBe(false);
  });

  it("disconnects both observers on unmount", () => {
    setReducedMotion(false);
    const { unmount } = render(<MotionLayer />);
    unmount();
    expect(observers.every((o) => o.disconnect.mock.calls.length === 1)).toBe(true);
  });
});
