import { useCallback, useMemo, useRef, useState } from "react";

import useArray from "./useArray";
import useLatest from "./useLatest";
import { ResizeObserverProvider } from "../types";

const useContainerWidth = (resizeObserverProvider?: ResizeObserverProvider, breakpoints?: number[]) => {
    const observerRef = useRef<ResizeObserver>();
    const breakpointsArray = useArray(breakpoints);
    const resizeObserverProviderLatest = useLatest(resizeObserverProvider);
    const [containerWidth, setContainerWidth] = useState<number>();

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

                setContainerWidth(newWidth);
            };

            updateWidth();

            if (node) {
                observerRef.current =
                    typeof ResizeObserver !== "undefined"
                        ? new ResizeObserver(updateWidth)
                        : resizeObserverProviderLatest.current?.(updateWidth);

                observerRef.current?.observe(node);
            }
        },
        [breakpointsArray, resizeObserverProviderLatest]
    );

    return useMemo(() => ({ containerRef, containerWidth }), [containerRef, containerWidth]);
};

export default useContainerWidth;
