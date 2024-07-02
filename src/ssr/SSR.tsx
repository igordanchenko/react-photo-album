import type React from "react";
import { cloneElement, isValidElement, useState } from "react";

import { clsx } from "../core/utils";
import { useContainerWidth } from "../client/hooks";
import { StyledBreakpoints, useBreakpoints } from "./breakpoints";
import { CommonPhotoAlbumProps } from "../types";

/** SSR component props. */
export type SSRProps = {
  /** Photo album layout breakpoints. */
  breakpoints: number[];
  /** Photo album instance, which must be the only child. */
  children: React.ReactElement<Pick<CommonPhotoAlbumProps, "breakpoints" | "defaultContainerWidth">>;
  /** If `true`, do not include the inline stylesheet. */
  unstyled?: boolean;
  /** Custom class names for the container and the breakpoint intervals. */
  classNames?: {
    /** Custom container class name. */
    container?: string;
    /** Custom class names for the breakpoint intervals. */
    breakpoints?: { [key: number]: string };
  };
};

/** Experimental SSR component. */
export default function SSR({ breakpoints: breakpointsProp, unstyled, classNames, children }: SSRProps) {
  const { breakpoints, containerClass, breakpointClass } = useBreakpoints("ssr", breakpointsProp);
  const { containerRef, containerWidth } = useContainerWidth(breakpoints);
  const [hydratedBreakpoint, setHydratedBreakpoint] = useState<number>();

  if (!Array.isArray(breakpoints) || breakpoints.length === 0 || !isValidElement(children)) return null;

  if (containerWidth !== undefined && hydratedBreakpoint === undefined) {
    setHydratedBreakpoint(containerWidth);
  }

  return (
    <>
      {!unstyled && hydratedBreakpoint === undefined && (
        <StyledBreakpoints
          breakpoints={breakpoints}
          containerClass={containerClass}
          breakpointClass={breakpointClass}
        />
      )}

      <div ref={containerRef} className={clsx(containerClass, classNames?.container)}>
        {breakpoints.map(
          (breakpoint) =>
            (hydratedBreakpoint === undefined || hydratedBreakpoint === breakpoint) && (
              <div
                key={breakpoint}
                className={clsx(breakpointClass(breakpoint), classNames?.breakpoints?.[breakpoint])}
              >
                {cloneElement(children, { breakpoints, defaultContainerWidth: breakpoint })}
              </div>
            ),
        )}
      </div>
    </>
  );
}
