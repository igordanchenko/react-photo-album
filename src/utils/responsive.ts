import { ResponsiveParameter } from "../types";

const breakpoints = Object.freeze([1200, 600, 300, 0]);

type AnyFunction = (...args: unknown[]) => unknown;

const unwrap = <T, P = T extends AnyFunction ? ReturnType<T> : T>(value: T, containerWidth: number): P =>
    typeof value === "function" ? value(containerWidth) : value;

export const unwrapParameter = <T>(value: ResponsiveParameter<T> | undefined, containerWidth: number): T | undefined =>
    typeof value !== "undefined" ? unwrap(value, containerWidth) : undefined;

const selectResponsiveValue = (values: ResponsiveParameter[], containerWidth: number): number => {
    const index = breakpoints.findIndex((breakpoint) => breakpoint <= containerWidth);
    return unwrap(values[index >= 0 ? index : 0], containerWidth);
};

export const resolveResponsiveParameter = (
    parameter: ResponsiveParameter | undefined,
    containerWidth: number,
    values: ResponsiveParameter[],
    minValue = 0
): number => {
    const value = unwrapParameter(parameter, containerWidth);
    return Math.round(Math.max(value === undefined ? selectResponsiveValue(values, containerWidth) : value, minValue));
};
