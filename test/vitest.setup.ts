import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

import { act, cleanup, fireEvent } from "./test-utils";

declare global {
  interface Window {
    __TEST__: {
      scrollbarWidth: number;
      isIntersecting: boolean;
    };
  }
}

vi.stubGlobal("__TEST__", {
  scrollbarWidth: 0,
  isIntersecting: true,
});

afterEach(() => {
  cleanup();
});

Object.defineProperties(HTMLElement.prototype, {
  clientWidth: {
    get() {
      if (
        this instanceof HTMLHtmlElement ||
        (this instanceof HTMLDivElement && this.className.includes("react-photo-album"))
      ) {
        return Math.max(window.innerWidth - window.__TEST__.scrollbarWidth, 0);
      }
      return 0;
    },
  },
});

vi.stubGlobal("resizeTo", (width: number, height: number) => {
  act(() => {
    window.innerWidth = width;
    window.innerHeight = height;

    fireEvent(window, new Event("resize"));
  });
});

function mockObserver(event: string, mockEntry?: () => object) {
  return class {
    readonly callback: (entry: object) => void;
    readonly targets: Element[];
    readonly listener: () => void;

    constructor(callback: (entry: object) => void) {
      this.callback = callback;
      this.targets = [];
      this.listener = () => {
        act(() => {
          this.callback(this.targets.map((target) => ({ target, ...mockEntry?.() })));
        });
      };

      window.addEventListener(event, this.listener);
    }

    observe(target: Element) {
      this.targets.push(target);
    }

    unobserve(target: Element) {
      this.targets.splice(this.targets.indexOf(target), 1);
    }

    disconnect() {
      window.removeEventListener(event, this.listener);
    }
  };
}

vi.stubGlobal("ResizeObserver", mockObserver("resize"));

vi.stubGlobal(
  "IntersectionObserver",
  mockObserver("intersect", () => ({ isIntersecting: window.__TEST__.isIntersecting })),
);
