import * as React from "react";

import clsx from "../../utils/clsx";
import round from "../../utils/round";
import { Optional, Photo, RenderColumnContainer, RenderColumnContainerProps } from "../../types";

function defaultRenderColumnContainer<T extends Photo = Photo>({
  columnContainerProps,
  children,
}: RenderColumnContainerProps<T>) {
  return <div {...columnContainerProps}>{children}</div>;
}

function cssColumnWidth<T extends Photo = Photo>(props: ColumnContainerRendererProps<T>) {
  const { layoutOptions, columnIndex, columnsCount, columnsGaps, columnsRatios } = props;
  const { layout, spacing, padding } = layoutOptions;

  if (layout === "masonry" || !columnsGaps || !columnsRatios) {
    return `calc((100% - ${spacing * (columnsCount - 1)}px) / ${columnsCount})`;
  }

  const totalRatio = columnsRatios.reduce((acc, ratio) => acc + ratio, 0);
  const totalAdjustedGaps = columnsRatios.reduce(
    (acc, ratio, index) => acc + (columnsGaps[columnIndex] - columnsGaps[index]) * ratio,
    0,
  );

  return `calc((100% - ${round(
    (columnsCount - 1) * spacing + 2 * columnsCount * padding + totalAdjustedGaps,
    3,
  )}px) * ${round(columnsRatios[columnIndex] / totalRatio, 5)} + ${2 * padding}px)`;
}

export type ColumnContainerRendererProps<T extends Photo = Photo> = Optional<
  RenderColumnContainerProps<T>,
  "columnContainerProps"
> & { renderColumnContainer?: RenderColumnContainer<T> };

export default function ColumnContainerRenderer<T extends Photo = Photo>(props: ColumnContainerRendererProps<T>) {
  const {
    layoutOptions,
    renderColumnContainer,
    children,
    columnContainerProps: { style, className, ...restColumnContainerProps } = {},
    ...rest
  } = props;

  const columnContainerProps = {
    className: clsx("react-photo-album--column", className),
    style: {
      display: "flex",
      flexDirection: "column",
      flexWrap: "nowrap",
      alignItems: "flex-start",
      width: cssColumnWidth(props),
      justifyContent: layoutOptions.layout === "columns" ? "space-between" : "flex-start",
      ...style,
    } as const,
    ...restColumnContainerProps,
  };

  return (
    <>
      {(renderColumnContainer ?? defaultRenderColumnContainer)({
        layoutOptions,
        columnContainerProps,
        children,
        ...rest,
      })}
    </>
  );
}
