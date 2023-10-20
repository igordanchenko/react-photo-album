import { ResponsiveParameter } from "../types";

const breakpoints = Object.freeze([1200, 600, 300, 0]);

type AnyFunction = (args: any) => unknown;

export function unwrap<V, A, R = V extends AnyFunction ? ReturnType<V> : V>(value: V, arg: A): R {
  return typeof value === "function" ? value(arg) : value;
}

export function unwrapParameter<T>(value: ResponsiveParameter<T> | undefined, containerWidth: number): T | undefined {
  return typeof value !== "undefined" ? unwrap(value, containerWidth) : undefined;
}

function selectResponsiveValue(values: ResponsiveParameter[], containerWidth: number): number {
  const index = breakpoints.findIndex((breakpoint) => breakpoint <= containerWidth);
  return unwrap(values[index >= 0 ? index : 0], containerWidth);
}

export function resolveResponsiveParameter(
  parameter: ResponsiveParameter | undefined,
  containerWidth: number,
  values: ResponsiveParameter[],
  minValue = 0,
): number {
  const value = unwrapParameter(parameter, containerWidth);
  return Math.round(Math.max(value === undefined ? selectResponsiveValue(values, containerWidth) : value, minValue));
}
