import * as React from "react";

type State = {
  containerWidth?: number;
  scrollbarWidth?: number;
};

type Action = {
  newContainerWidth?: number;
  newScrollbarWidth?: number;
};

function containerWidthReducer(state: State, { newContainerWidth, newScrollbarWidth }: Action) {
  const { containerWidth, scrollbarWidth } = state;

  /* c8 ignore start */
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
    return { containerWidth, scrollbarWidth: newScrollbarWidth };
  }

  return containerWidth !== newContainerWidth || scrollbarWidth !== newScrollbarWidth
    ? { containerWidth: newContainerWidth, scrollbarWidth: newScrollbarWidth }
    : state;
  /* c8 ignore stop */
}

function resolveContainerWidth(el: HTMLElement | null, breakpoints: readonly number[] | undefined) {
  let width = el?.clientWidth;
  if (width !== undefined && breakpoints && breakpoints.length > 0) {
    const sorted = [...breakpoints.filter((x) => x > 0)].sort((a, b) => b - a);
    sorted.push(Math.floor(sorted[sorted.length - 1] / 2));
    const threshold = width;
    width = sorted.find((breakpoint, index) => breakpoint <= threshold || index === sorted.length - 1);
  }
  return width;
}

export default function useContainerWidth(
  breakpoints: readonly number[] | undefined,
  defaultContainerWidth: number | undefined,
) {
  const [{ containerWidth }, dispatch] = React.useReducer(containerWidthReducer, {
    containerWidth: defaultContainerWidth,
  });

  const ref = React.useRef<HTMLElement | null>(null);
  const observerRef = React.useRef<ResizeObserver>();

  const containerRef = React.useCallback(
    (node: HTMLElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = undefined;

      ref.current = node;

      const updateWidth = () =>
        dispatch({
          newContainerWidth: resolveContainerWidth(ref.current, breakpoints),
          newScrollbarWidth: window.innerWidth - document.documentElement.clientWidth,
        });

      updateWidth();

      if (node && typeof ResizeObserver !== "undefined") {
        observerRef.current = new ResizeObserver(updateWidth);
        observerRef.current.observe(node);
      }
    },
    [breakpoints],
  );

  return { containerRef, containerWidth };
}
