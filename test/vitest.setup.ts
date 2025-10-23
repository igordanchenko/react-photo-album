import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";

import { act, cleanup, fireEvent } from "./test-utils";

declare global {
  interface Window {
    scrollbarWidth?: number;
    isIntersecting?: boolean;
  }
}

beforeEach(() => {
  window.scrollbarWidth = 0;
  window.isIntersecting = true;
});

afterEach(() => {
  cleanup();
});

Object.defineProperties(window.HTMLElement.prototype, {
  clientWidth: {
    get() {
      if (
        this instanceof HTMLHtmlElement ||
        (this instanceof HTMLDivElement && this.className.includes("react-photo-album"))
      ) {
        return Math.max(window.innerWidth - (window.scrollbarWidth || 0), 0);
      }
      return 0;
    },
  },
});

window.resizeTo = (width: number, height: number) => {
  act(() => {
    window.innerWidth = width;
    window.innerHeight = height;

    fireEvent(window, new Event("resize"));
  });
};

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
  mockObserver("intersect", () => ({ isIntersecting: window.isIntersecting })),
);
