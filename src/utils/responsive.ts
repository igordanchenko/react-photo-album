import { ResponsiveParameter } from "../types";

type Breakpoints = readonly number[];

const breakpoints = Object.freeze([1600, 1200, 768, 480, 300, 0]);

const unwrap = (value: ResponsiveParameter, containerWidth: number): number =>
    typeof value === "function" ? value(containerWidth) : value;

const unwrapParameter = (value: ResponsiveParameter | undefined, containerWidth: number): number | undefined =>
    typeof value !== "undefined" ? unwrap(value, containerWidth) : undefined;

const selectResponsiveValue = (values: Breakpoints, containerWidth: number): number => {
    const index = breakpoints.findIndex((x) => x < containerWidth);
    return index === 0
        ? values[index]
        : values[index] +
              Math.floor(
                  ((values[index - 1] - values[index]) * (containerWidth - breakpoints[index])) /
                      (breakpoints[index - 1] - breakpoints[index])
              );
};

const resolveResponsiveParameter = (
    parameter: ResponsiveParameter | undefined,
    containerWidth: number,
    values: Breakpoints
): number => {
    const value = unwrapParameter(parameter, containerWidth);
    return value === undefined ? selectResponsiveValue(values, containerWidth) : value;
};

export default resolveResponsiveParameter;
