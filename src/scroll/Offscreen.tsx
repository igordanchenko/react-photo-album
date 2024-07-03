import type React from "react";
import { cloneElement, useCallback, useState } from "react";

import useIntersectionObserver from "./useIntersectionObserver";

type Placeholder = {
  width: number;
  height: number;
  margin: string;
};

type OffscreenProps = {
  rootMargin: string;
  children: React.ReactElement;
};

export default function Offscreen({ rootMargin, children }: OffscreenProps) {
  const [placeholder, setPlaceholder] = useState<Placeholder>();

  const { observe, unobserve } = useIntersectionObserver(rootMargin);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      unobserve();

      if (node) {
        observe(node, ({ isIntersecting }) => {
          if (!isIntersecting) {
            const { width, height } = node.getBoundingClientRect();
            const { margin } = getComputedStyle(node);
            setPlaceholder({ width, height, margin });
          } else {
            setPlaceholder(undefined);
          }
        });
      }
    },
    [observe, unobserve],
  );

  return !placeholder ? cloneElement(children, { ref }) : <div ref={ref} style={placeholder} />;
}
