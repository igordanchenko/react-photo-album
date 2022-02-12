import { useCallback, useMemo, useRef, useState } from "react";
import { ResizeObserverProvider } from "../types";

const useContainerWidth = (resizeObserverProvider?: ResizeObserverProvider, breakpoints?: number[]) => {
    const observerRef = useRef<ResizeObserver>();
    const containerRef = useRef<HTMLDivElement>();

    const [width, setWidth] = useState<number>();

    const updateWidth = useCallback(() => {
        let newWidth = containerRef.current?.clientWidth;

        if (newWidth !== undefined && breakpoints && breakpoints.length > 0) {
            const containerWidth = newWidth;
            const sortedBreakpoints = [...breakpoints.filter((x) => x > 0)].sort((a, b) => b - a);
            sortedBreakpoints.push(Math.floor(sortedBreakpoints[sortedBreakpoints.length - 1] / 2));
            newWidth = sortedBreakpoints.find(
                (breakpoint, index) => breakpoint <= containerWidth || index === sortedBreakpoints.length - 1
            );
        }

        setWidth(newWidth);
    }, [breakpoints]);

    const ref = useCallback(
        (node) => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = undefined;
            }

            containerRef.current = node;

            updateWidth();

            if (node) {
                observerRef.current =
                    typeof ResizeObserver !== "undefined"
                        ? new ResizeObserver(updateWidth)
                        : resizeObserverProvider?.(updateWidth);

                observerRef.current?.observe(node);
            }
        },
        [resizeObserverProvider, updateWidth]
    );

    return useMemo(() => ({ ref, width }), [ref, width]);
};

export default useContainerWidth;
