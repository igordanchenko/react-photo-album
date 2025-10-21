import { useId } from "react";

import { cssClass } from "../../utils";

function convertBreakpoints(breakpoints: number[]) {
  if (!breakpoints || breakpoints.length === 0) return [];
  const allBreakpoints = [Math.min(...breakpoints) / 2, ...breakpoints];
  allBreakpoints.sort((a, b) => a - b);
  return allBreakpoints;
}

export default function useBreakpoints(prefix: string, breakpoints: number[]) {
  const uid = `${prefix}-${useId().replace(/[«»:_]/g, "")}`;

  return {
    containerClass: cssClass(uid),
    breakpointClass: (breakpoint: number) => cssClass(`${uid}-${breakpoint}`),
    breakpoints: convertBreakpoints(breakpoints),
  };
}
