import type React from "react";
import { cloneElement, isValidElement, useId, useState } from "react";

import { useContainerWidth } from "../hooks";
import { cssClass } from "../../core/utils";
import { CommonPhotoAlbumProps } from "../../types";

export type SSRProps = {
  /** Photo album layout breakpoints. */
  breakpoints: number[];
  /** Photo album instance, which must be the only child. */
  children: React.ReactElement<Pick<CommonPhotoAlbumProps, "breakpoints" | "defaultContainerWidth">>;
};

export default function SSR({ breakpoints, children }: SSRProps) {
  const uid = `ssr-${useId().replace(/:/g, "")}`;
  const { containerRef, containerWidth } = useContainerWidth(breakpoints);
  const [hydratedBreakpoint, setHydratedBreakpoint] = useState<number>();

  if (!Array.isArray(breakpoints) || breakpoints.length === 0 || !isValidElement(children)) return null;

  if (containerWidth !== undefined && hydratedBreakpoint === undefined) {
    setHydratedBreakpoint(containerWidth);
  }

  const containerClass = cssClass(uid);
  const breakpointClass = (breakpoint: number) => cssClass(`${uid}-${breakpoint}`);

  const allBreakpoints = [Math.min(...breakpoints) / 2, ...breakpoints];
  allBreakpoints.sort((a, b) => a - b);

  return (
    <>
      {hydratedBreakpoint === undefined && (
        <style>
          {[
            `.${containerClass}{container-type:inline-size}`,
            `${allBreakpoints.map((breakpoint) => `.${breakpointClass(breakpoint)}`).join()}{display:none}`,
            ...allBreakpoints.map(
              (breakpoint, index, array) =>
                `@container(min-width:${index > 0 ? breakpoint : 0}px)${index < array.length - 1 ? ` and (max-width:${array[index + 1] - 1}px)` : ""}{.${breakpointClass(breakpoint)}{display:block}}`,
            ),
          ].join("\n")}
        </style>
      )}

      <div ref={containerRef} className={containerClass}>
        {allBreakpoints.map(
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
