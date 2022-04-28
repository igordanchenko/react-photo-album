import { useCallback, useMemo, useRef, useState } from "react";

import useArray from "./useArray";
import useLatest from "./useLatest";
import { ResizeObserverProvider } from "../types";

const useContainerWidth = (resizeObserverProvider?: ResizeObserverProvider, breakpoints?: number[]) => {
    const [containerWidth, setContainerWidth] = useState<number>();
    const observerRef = useRef<ResizeObserver>();
    const breakpointsArray = useArray(breakpoints);
    const resizeObserverProviderRef = useLatest(resizeObserverProvider);
    const containerWidthRef = useLatest(containerWidth);
    const scrollbarWidthRef = useRef<number>();

    const containerRef = useCallback(
        (node: HTMLElement | null) => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = undefined;
            }

            const updateWidth = () => {
                let newWidth = node?.clientWidth;

                if (newWidth !== undefined && breakpointsArray && breakpointsArray.length > 0) {
                    const sortedBreakpoints = [...breakpointsArray.filter((x) => x > 0)].sort((a, b) => b - a);
                    sortedBreakpoints.push(Math.floor(sortedBreakpoints[sortedBreakpoints.length - 1] / 2));
                    const threshold = newWidth;
                    newWidth = sortedBreakpoints.find(
                        (breakpoint, index) => breakpoint <= threshold || index === sortedBreakpoints.length - 1
                    );
                }

                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
                const previousScrollbarWidth = scrollbarWidthRef.current;
                scrollbarWidthRef.current = scrollbarWidth;

                /* istanbul ignore next */
                if (
                    containerWidthRef.current !== undefined &&
                    previousScrollbarWidth !== undefined &&
                    newWidth !== undefined &&
                    newWidth > containerWidthRef.current &&
                    newWidth - containerWidthRef.current <= 20 &&
                    scrollbarWidth < previousScrollbarWidth
                ) {
                    // prevent infinite resize loop when scrollbar disappears
                    return;
                }

                setContainerWidth(newWidth);
            };

            updateWidth();

            if (node) {
                observerRef.current =
                    typeof ResizeObserver !== "undefined"
                        ? new ResizeObserver(updateWidth)
                        : resizeObserverProviderRef.current?.(updateWidth);

                observerRef.current?.observe(node);
            }
        },
        [breakpointsArray, resizeObserverProviderRef, containerWidthRef]
    );

    return useMemo(() => ({ containerRef, containerWidth }), [containerRef, containerWidth]);
};

export default useContainerWidth;
