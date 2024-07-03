import { CommonPhotoAlbumProps, Photo, ResponsiveParameter } from "../types";

const breakpoints = Object.freeze([1200, 600, 300, 0]);

export function unwrap<Value, Arg, Return = Value extends (args: any) => unknown ? ReturnType<Value> : Value>(
  value: Value,
  arg: Arg,
): Return {
  return typeof value === "function" ? value(arg) : value;
}

export function unwrapParameter<Value>(
  value: ResponsiveParameter<Value> | undefined,
  containerWidth: number | undefined,
): Value | undefined {
  return containerWidth !== undefined ? unwrap(value, containerWidth) : undefined;
}

function selectResponsiveValue(values: ResponsiveParameter[], containerWidth: number) {
  const index = breakpoints.findIndex((breakpoint) => breakpoint <= containerWidth);
  return unwrap(values[Math.max(index, 0)], containerWidth);
}

export function resolveResponsiveParameter(
  parameter: ResponsiveParameter | undefined,
  containerWidth: number | undefined,
  values: ResponsiveParameter[],
  minValue = 0,
) {
  if (containerWidth === undefined) return undefined;
  const value = unwrapParameter(parameter, containerWidth);
  return Math.round(Math.max(value === undefined ? selectResponsiveValue(values, containerWidth) : value, minValue));
}

export function resolveCommonProps<TPhoto extends Photo>(
  containerWidth: number | undefined,
  {
    spacing,
    padding,
    componentsProps,
    render,
  }: Pick<CommonPhotoAlbumProps<TPhoto>, "spacing" | "padding" | "componentsProps" | "render">,
) {
  return {
    spacing: resolveResponsiveParameter(spacing, containerWidth, [20, 15, 10, 5]),
    padding: resolveResponsiveParameter(padding, containerWidth, [0, 0, 0, 0]),
    componentsProps: unwrap(componentsProps, containerWidth) || {},
    render: unwrap(render, containerWidth),
  };
}
