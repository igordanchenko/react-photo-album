import "@testing-library/jest-dom/vitest";

import { act, cleanup, fireEvent } from "./test-utils";

afterEach(() => {
  cleanup();
});

declare global {
  interface Window {
    scrollbarWidth?: number;
  }
}

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

global.ResizeObserver = vi.fn().mockImplementation((observer) => {
  window.addEventListener("resize", observer);
  return {
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {
      window.removeEventListener("resize", observer);
    },
  };
});
