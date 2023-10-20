import * as React from "react";

import RowsLayout from "./components/layouts/RowsLayout";
import ColumnsLayout from "./components/layouts/ColumnsLayout";
import MasonryLayout from "./components/layouts/MasonryLayout";
import ContainerRenderer from "./components/renderers/ContainerRenderer";
import useArray from "./hooks/useArray";
import useContainerWidth from "./hooks/useContainerWidth";
import { resolveResponsiveParameter, unwrap, unwrapParameter } from "./utils/responsive";
import { ComponentsProps, Photo, PhotoAlbumProps } from "./types";

function resolveLayoutOptions<T extends Photo>({
  layout,
  onClick,
  containerWidth,
  targetRowHeight,
  rowConstraints,
  columns,
  spacing,
  padding,
  sizes,
}: Omit<PhotoAlbumProps<T>, "photos"> & {
  containerWidth: number;
}) {
  return {
    layout,
    onClick,
    containerWidth,
    columns: resolveResponsiveParameter(columns, containerWidth, [5, 4, 3, 2], 1),
    spacing: resolveResponsiveParameter(spacing, containerWidth, [20, 15, 10, 5]),
    padding: resolveResponsiveParameter(padding, containerWidth, [0, 0, 0, 0, 0]),
    targetRowHeight: resolveResponsiveParameter(targetRowHeight, containerWidth, [
      (w) => w / 5,
      (w) => w / 4,
      (w) => w / 3,
      (w) => w / 2,
    ]),
    rowConstraints: unwrapParameter(rowConstraints, containerWidth),
    sizes,
  };
}

function resolveComponentsProps<T extends Photo>(
  props: PhotoAlbumProps<T>,
  containerWidth?: number,
  layoutOptions?: ReturnType<typeof resolveLayoutOptions<T>>,
) {
  const { photos, componentsProps: componentsPropsProp } = props;

  const componentsProps = unwrap(componentsPropsProp, containerWidth) || {};

  if (layoutOptions) {
    const { layout, spacing, padding, rowConstraints } = layoutOptions;

    if (layout === "rows") {
      const { singleRowMaxHeight } = rowConstraints || {};
      if (singleRowMaxHeight) {
        const maxWidth = Math.floor(
          photos.reduce(
            (acc, { width, height }) => acc + (width / height) * singleRowMaxHeight - 2 * padding,
            padding * photos.length * 2 + spacing * (photos.length - 1),
          ),
        );

        if (maxWidth > 0) {
          componentsProps.containerProps = componentsProps.containerProps || {};
          componentsProps.containerProps.style = { maxWidth, ...componentsProps.containerProps.style };
        }
      }
    }
  }

  return componentsProps;
}

function renderLayout<T extends Photo>(
  props: PhotoAlbumProps<T>,
  componentsProps: ComponentsProps,
  layoutOptions: ReturnType<typeof resolveLayoutOptions<T>>,
) {
  const { photos, layout, renderPhoto, renderRowContainer, renderColumnContainer } = props;

  const commonLayoutProps = { photos, renderPhoto, componentsProps };

  if (layout === "rows") {
    return (
      <RowsLayout
        layoutOptions={layoutOptions as typeof layoutOptions & { layout: "rows" }}
        renderRowContainer={renderRowContainer}
        {...commonLayoutProps}
      />
    );
  }

  if (layout === "columns") {
    return (
      <ColumnsLayout
        layoutOptions={layoutOptions as typeof layoutOptions & { layout: "columns" }}
        renderColumnContainer={renderColumnContainer}
        {...commonLayoutProps}
      />
    );
  }

  return (
    <MasonryLayout
      layoutOptions={layoutOptions as typeof layoutOptions & { layout: "masonry" }}
      renderColumnContainer={renderColumnContainer}
      {...commonLayoutProps}
    />
  );
}

export default function PhotoAlbum<T extends Photo>(props: PhotoAlbumProps<T>) {
  const { photos, layout, renderContainer, defaultContainerWidth, breakpoints } = props;

  const { containerRef, containerWidth } = useContainerWidth(useArray(breakpoints), defaultContainerWidth);

  // safeguard against incorrect usage
  if (!layout || !["rows", "columns", "masonry"].includes(layout) || !Array.isArray(photos)) return null;

  const layoutOptions = containerWidth ? resolveLayoutOptions({ containerWidth, ...props }) : undefined;

  const componentsProps = resolveComponentsProps(props, containerWidth, layoutOptions);

  return (
    <ContainerRenderer
      layout={layout}
      containerRef={containerRef}
      renderContainer={renderContainer}
      containerProps={componentsProps.containerProps}
    >
      {layoutOptions && renderLayout(props, componentsProps, layoutOptions)}
    </ContainerRenderer>
  );
}
