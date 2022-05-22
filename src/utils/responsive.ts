import { ResponsiveParameter } from "../types";

type AnyFunction = (...args: unknown[]) => unknown;

const breakpoints = Object.freeze([1200, 600, 300, 0]);

const unwrap = <T, P = T extends AnyFunction ? ReturnType<T> : T>(value: T, containerWidth: number): P => {
    return typeof value === "function" ? value(containerWidth) : value;
};

const unwrapParameter = <T>(value: ResponsiveParameter<T> | undefined, containerWidth: number): T | undefined =>
    value ? unwrap(value, containerWidth) : undefined;

const selectResponsiveValue = <T>(values: ResponsiveParameter<T>[], containerWidth: number): T => {
    const index = breakpoints.findIndex((breakpoint) => breakpoint <= containerWidth);
    return unwrap(values[index >= 0 ? index : 0], containerWidth);
};

const resolveResponsiveParameter = <T>(
    parameter: ResponsiveParameter<T> | undefined,
    containerWidth: number,
    values: ResponsiveParameter<T>[]
): T => {
    return unwrapParameter(parameter, containerWidth) ?? selectResponsiveValue(values, containerWidth);
};

export default resolveResponsiveParameter;
