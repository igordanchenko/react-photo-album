import type React from "react";
import { cloneElement, useCallback, useState } from "react";

import useIntersectionObserver from "./useIntersectionObserver";

type Placeholder = {
  aspectRatio: string;
  margin: string;
};

type OffscreenProps = {
  rootMargin: string;
  scrollContainer?: () => HTMLElement | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
};

export default function Offscreen({ rootMargin, scrollContainer, children }: OffscreenProps) {
  const [placeholder, setPlaceholder] = useState<Placeholder>();

  const { observe, unobserve } = useIntersectionObserver(rootMargin, scrollContainer);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      unobserve();

      if (node) {
        observe(node, ({ isIntersecting }) => {
          if (!isIntersecting) {
            const { width, height } = node.getBoundingClientRect();
            const { margin } = getComputedStyle(node);
            setPlaceholder({ aspectRatio: `${width} / ${height}`, margin });
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
