import { useRef, useState } from "react";

import useEventCallback from "./useEventCallback";
import { ResizeObserverProvider } from "../types";

const useContainerWidth = (resizeObserverProvider?: ResizeObserverProvider, breakpoints?: number[]) => {
    const [containerWidth, setContainerWidth] = useState<number>();
    const [scrollbarWidth, setScrollbarWidth] = useState<number>();

    const ref = useRef<HTMLElement | null>(null);
    const observerRef = useRef<ResizeObserver>();

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

    const containerRef = useEventCallback((node: HTMLElement | null) => {
        observerRef.current?.disconnect();
        observerRef.current = undefined;

        ref.current = node;

        updateWidth();

        if (node) {
            observerRef.current =
                typeof ResizeObserver !== "undefined"
                    ? new ResizeObserver(updateWidth)
                    : resizeObserverProvider?.(updateWidth);

            observerRef.current?.observe(node);
        }
    });

    return { containerRef, containerWidth };
};

export default useContainerWidth;
