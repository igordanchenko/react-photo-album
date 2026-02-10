import { useCallback, useReducer, useRef } from "react";

import useArray from "./useArray";
import type { ForwardedRef } from "../../types";

type State = [containerWidth?: number, scrollbarWidth?: number];

type Action = [newContainerWidth?: number, newScrollbarWidth?: number];

function containerWidthReducer(state: State, [newContainerWidth, newScrollbarWidth]: Action): State {
  const [containerWidth, scrollbarWidth] = state;

  if (
    containerWidth !== undefined &&
    scrollbarWidth !== undefined &&
    newContainerWidth !== undefined &&
    newScrollbarWidth !== undefined &&
    newContainerWidth > containerWidth &&
    newContainerWidth - containerWidth <= 20 &&
    newScrollbarWidth < scrollbarWidth
  ) {
    // prevent infinite resize loop when scrollbar disappears
    return [containerWidth, newScrollbarWidth];
  }

  return containerWidth !== newContainerWidth || scrollbarWidth !== newScrollbarWidth
    ? [newContainerWidth, newScrollbarWidth]
    : state;
}

function resolveContainerWidth(el: HTMLElement | null, breakpoints: readonly number[] | undefined) {
  let width = el?.clientWidth;
  if (width !== undefined && breakpoints && breakpoints.length > 0) {
    const sorted = [...breakpoints.filter((x) => x > 0)].sort((a, b) => b - a);
    sorted.push(Math.floor(sorted[sorted.length - 1] / 2));
    width = sorted.find((breakpoint, index) => breakpoint <= width! || index === sorted.length - 1);
  }
  return width;
}

export default function useContainerWidth(
  ref: ForwardedRef,
  breakpointsArray: readonly number[] | undefined,
  defaultContainerWidth?: number,
) {
  const [[containerWidth], dispatch] = useReducer(containerWidthReducer, [defaultContainerWidth]);
  const breakpoints = useArray(breakpointsArray);
  const observerRef = useRef<ResizeObserver>(undefined);

  const containerRef = useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = undefined;

      const updateWidth = () =>
        dispatch([resolveContainerWidth(node, breakpoints), window.innerWidth - document.documentElement.clientWidth]);

      updateWidth();

      if (node && typeof ResizeObserver !== "undefined") {
        observerRef.current = new ResizeObserver(updateWidth);
        observerRef.current.observe(node);
      }

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        // TODO: false positive lint?
        // eslint-disable-next-line react-hooks/immutability
        ref.current = node;
      }
    },
    [ref, breakpoints],
  );

  return { containerRef, containerWidth };
}
