import * as React from "react";

import useEventCallback from "./useEventCallback";

const useContainerWidth = (breakpoints: number[] | undefined, defaultContainerWidth: number | undefined) => {
    const [containerWidth, setContainerWidth] = React.useState<number | undefined>(defaultContainerWidth);
    const [scrollbarWidth, setScrollbarWidth] = React.useState<number>();

    const ref = React.useRef<HTMLElement | null>(null);
    const observerRef = React.useRef<ResizeObserver>();

    const updateWidth = useEventCallback(() => {
        let newWidth = ref.current?.clientWidth;

        if (newWidth !== undefined && breakpoints && breakpoints.length > 0) {
            const sortedBreakpoints = [...breakpoints.filter((x) => x > 0)].sort((a, b) => b - a);
            sortedBreakpoints.push(Math.floor(sortedBreakpoints[sortedBreakpoints.length - 1] / 2));
            const threshold = newWidth;
            newWidth = sortedBreakpoints.find(
                (breakpoint, index) => breakpoint <= threshold || index === sortedBreakpoints.length - 1
            );
        }

        const newScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (newScrollbarWidth !== scrollbarWidth) {
            setScrollbarWidth(newScrollbarWidth);
        }

        /* istanbul ignore next */
        if (
            containerWidth !== undefined &&
            scrollbarWidth !== undefined &&
            newWidth !== undefined &&
            newWidth > containerWidth &&
            newWidth - containerWidth <= 20 &&
            newScrollbarWidth < scrollbarWidth
        ) {
            // prevent infinite resize loop when scrollbar disappears
            return;
        }

        if (newWidth !== containerWidth) {
            setContainerWidth(newWidth);
        }
    });

    const containerRef = React.useCallback(
        (node: HTMLElement | null) => {
            observerRef.current?.disconnect();
            observerRef.current = undefined;

            ref.current = node;

            updateWidth();

            if (node) {
                if (typeof ResizeObserver !== "undefined") {
                    observerRef.current = new ResizeObserver(updateWidth);
                    observerRef.current.observe(node);
                }
            }
        },
        [updateWidth]
    );

    return { containerRef, containerWidth };
};

export default useContainerWidth;
