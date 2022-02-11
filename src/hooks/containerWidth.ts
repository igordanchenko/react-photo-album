import { useCallback, useMemo, useRef, useState } from "react";
import { ResizeObserverProvider } from "../types";

const useContainerWidth = (resizeObserverProvider?: ResizeObserverProvider) => {
    const observerRef = useRef<ResizeObserver>();
    const containerRef = useRef<HTMLDivElement>();

    const [width, setWidth] = useState<number>();

    const ref = useCallback(
        (node) => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = undefined;
            }

            containerRef.current = node;

            const updateWidth = () => {
                const newWidth = containerRef.current?.clientWidth;
                setWidth(newWidth);
            };

            updateWidth();

            if (node) {
                const observerCallback = () => updateWidth();

                observerRef.current =
                    typeof ResizeObserver !== "undefined"
                        ? new ResizeObserver(observerCallback)
                        : resizeObserverProvider?.(observerCallback);

                observerRef.current?.observe(node);
            }
        },
        [resizeObserverProvider]
    );

    return useMemo(() => ({ ref, width }), [ref, width]);
};

export default useContainerWidth;
