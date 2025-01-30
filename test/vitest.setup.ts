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
    // noinspection JSConstantReassignment
    window.innerWidth = width;
    // noinspection JSConstantReassignment
    window.innerHeight = height;

    fireEvent(window, new Event("resize"));
  });
};

function mockObserver<MockEntry extends object>(event: string, mockEntry?: () => MockEntry) {
  return vi.fn().mockImplementation((callback) => {
    const targets: Element[] = [];

    const listener = () => {
      act(() => {
        callback(targets.map((target) => ({ target, ...mockEntry?.() })));
      });
    };

    window.addEventListener(event, listener);

    return {
      observe: (target: Element) => {
        targets.push(target);
      },
      unobserve: (target: Element) => {
        targets.splice(targets.indexOf(target), 1);
      },
      disconnect: () => {
        window.removeEventListener(event, listener);
      },
    };
  });
}

global.ResizeObserver = mockObserver("resize");

global.IntersectionObserver = mockObserver("intersect", () => ({ isIntersecting: window.isIntersecting }));
