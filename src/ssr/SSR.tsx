import type React from "react";
import { cloneElement, isValidElement, useState } from "react";

import { useContainerWidth } from "../client/hooks";
import { CommonPhotoAlbumProps } from "../types";
import { StyledBreakpoints, useBreakpoints } from "./breakpoints/index";

/** SSR component props. */
export type SSRProps = {
  /** Photo album layout breakpoints. */
  breakpoints: number[];
  /** Photo album instance, which must be the only child. */
  children: React.ReactElement<Pick<CommonPhotoAlbumProps, "breakpoints" | "defaultContainerWidth">>;
};

/** Experimental SSR component. */
export default function SSR({ breakpoints: breakpointsProp, children }: SSRProps) {
  const { breakpoints, containerClass, breakpointClass } = useBreakpoints("ssr", breakpointsProp);
  const { containerRef, containerWidth } = useContainerWidth(breakpoints);
  const [hydratedBreakpoint, setHydratedBreakpoint] = useState<number>();

  if (!Array.isArray(breakpoints) || breakpoints.length === 0 || !isValidElement(children)) return null;

  if (containerWidth !== undefined && hydratedBreakpoint === undefined) {
    setHydratedBreakpoint(containerWidth);
  }

  return (
    <>
      {hydratedBreakpoint === undefined && (
        <StyledBreakpoints
          breakpoints={breakpoints}
          containerClass={containerClass}
          breakpointClass={breakpointClass}
        />
      )}

      <div ref={containerRef} className={containerClass}>
        {breakpoints.map(
          (breakpoint) =>
            (hydratedBreakpoint === undefined || hydratedBreakpoint === breakpoint) && (
              <div key={breakpoint} className={breakpointClass(breakpoint)}>
                {cloneElement(children, { breakpoints, defaultContainerWidth: breakpoint })}
              </div>
            ),
        )}
      </div>
    </>
  );
}
