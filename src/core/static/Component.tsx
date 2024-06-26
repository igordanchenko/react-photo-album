import type React from "react";
import { forwardRef } from "react";

import { clsx, cssClass, cssVar, round } from "../utils";
import { LayoutVariables, RenderFunction } from "../../types";

type BaseProps<Component extends React.ElementType> = Pick<
  React.ComponentProps<Component>,
  "children" | "style" | "className"
>;

type PolymorphicRef<Component extends React.ElementType> = React.ComponentPropsWithRef<Component>["ref"];

type ElementProps<
  Component extends React.ElementType,
  Context extends {} | void,
  RenderProps extends BaseProps<Component>,
> = Partial<RenderProps> &
  Omit<React.ComponentProps<Component>, keyof RenderProps> & {
    as?: Component;
    render?: RenderFunction<RenderProps, Context>;
    context?: Context;
    classes?: string | (string | undefined)[];
    variables?: LayoutVariables;
  };

export default forwardRef(function Component<
  Component extends React.ElementType,
  Context extends {} | void,
  RenderProps extends BaseProps<Component>,
>(
  {
    as,
    render,
    context,
    classes = [],
    variables = {},
    style: styleProp,
    className: classNameProp,
    children,
    ...rest
  }: ElementProps<Component, Context, RenderProps>,
  ref: PolymorphicRef<Component>,
) {
  const className = clsx(
    ...(Array.isArray(classes) ? classes : [classes]).filter((el) => typeof el === "string").map(cssClass),
    classNameProp,
  );

  const style = {
    ...Object.fromEntries(
      Object.entries(variables).map(([key, value]) => [
        cssVar(key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()),
        typeof value === "number" ? round(value, 5) : value,
      ]),
    ),
    ...styleProp,
  };

  const props = { style, className, children, ...rest };

  if (render) {
    const rendered = render({ ref, ...props } as unknown as RenderProps, context as Context);
    if (rendered) return rendered;
  }

  const Element = as || "div";
  return <Element ref={ref} {...props} />;
}) as <Component extends React.ElementType, Context extends {} | void, RenderProps extends BaseProps<Component>>(
  props: ElementProps<Component, Context, RenderProps> & { ref?: PolymorphicRef<Component> },
) => React.ReactNode;
