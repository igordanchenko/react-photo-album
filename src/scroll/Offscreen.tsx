import type React from "react";
import { cloneElement, useCallback, useState } from "react";

import useIntersectionObserver from "./useIntersectionObserver";

type Placeholder = {
  aspectRatio: string;
  margin: string;
};

type OffscreenProps<TProps> = {
  rootMargin: string;
  scrollContainer?: () => HTMLElement | null;
  children: React.ReactElement<TProps>;
};

export default function Offscreen<TProps>({ rootMargin, scrollContainer, children }: OffscreenProps<TProps>) {
  const [placeholder, setPlaceholder] = useState<Placeholder>();

  const { observe, unobserve } = useIntersectionObserver(rootMargin, scrollContainer);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      unobserve();

      if (node) {
        observe(node, ({ isIntersecting }) => {
          if (isIntersecting) {
            setPlaceholder(undefined);
            return;
          }

          const { width, height } = node.getBoundingClientRect();
          const { marginTop, marginRight, marginBottom, marginLeft } = getComputedStyle(node);

          setPlaceholder(
            (prev) =>
              prev || {
                aspectRatio: `${width} / ${height}`,
                margin: `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`,
              },
          );
        });
      }
    },
    [observe, unobserve],
  );

  return placeholder ? (
    // width: 100% prevents placeholder collapse in flex containers
    <div ref={ref} style={{ width: "100%", ...placeholder }} />
  ) : (
    cloneElement(children as React.ReactElement<Record<string, unknown>>, { ref })
  );
}
