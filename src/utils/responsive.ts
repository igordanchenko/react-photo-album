import { ResponsiveParameter } from "../types";

const breakpoints = Object.freeze([1200, 600, 300, 0]);

const unwrap = (value: ResponsiveParameter, containerWidth: number): number =>
    typeof value === "function" ? value(containerWidth) : value;

const unwrapParameter = (value: ResponsiveParameter | undefined, containerWidth: number): number | undefined =>
    typeof value !== "undefined" ? unwrap(value, containerWidth) : undefined;

const selectResponsiveValue = (values: ResponsiveParameter[], containerWidth: number): number => {
    const index = breakpoints.findIndex((breakpoint) => breakpoint <= containerWidth);
    return unwrap(values[index >= 0 ? index : 0], containerWidth);
};

const resolveResponsiveParameter = (
    parameter: ResponsiveParameter | undefined,
    containerWidth: number,
    values: ResponsiveParameter[]
): number => {
    const value = unwrapParameter(parameter, containerWidth);
    return value === undefined ? selectResponsiveValue(values, containerWidth) : value;
};

export default resolveResponsiveParameter;
