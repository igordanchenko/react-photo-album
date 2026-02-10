type StyledBreakpointsProps = {
  breakpoints: readonly number[];
  containerClass: string;
  breakpointClass: (breakpoint: number) => string;
};

export default function StyledBreakpoints({ breakpoints, containerClass, breakpointClass }: StyledBreakpointsProps) {
  return (
    <style>
      {[
        `.${containerClass}{container-type:inline-size}`,
        `${breakpoints.map((breakpoint) => `.${breakpointClass(breakpoint)}`).join()}{display:none}`,
        ...breakpoints.map(
          (breakpoint, index, array) =>
            `@container(min-width:${index > 0 ? breakpoint : 0}px)${index < array.length - 1 ? ` and (max-width:${array[index + 1] - 1}px)` : ""}{.${breakpointClass(breakpoint)}{display:block}}`,
        ),
      ].join("\n")}
    </style>
  );
}
