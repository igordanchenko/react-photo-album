import { useMemo } from "react";

import { useContainerWidth } from "../hooks";
import StaticPhotoAlbum from "../../core/static";
import computeRowsLayout from "../../layouts/rows";
import { resolveCommonProps, resolveResponsiveParameter, unwrapParameter } from "../../core/utils";
import { Photo, RowsPhotoAlbumProps } from "../../types";

function resolveProps<TPhoto extends Photo>(
  containerWidth: number | undefined,
  {
    targetRowHeight,
    rowConstraints,
    ...rest
  }: Pick<
    RowsPhotoAlbumProps<TPhoto>,
    "spacing" | "padding" | "componentsProps" | "targetRowHeight" | "rowConstraints"
  >,
) {
  return {
    targetRowHeight: resolveResponsiveParameter(targetRowHeight, containerWidth, [
      (w) => w / 5,
      (w) => w / 4,
      (w) => w / 3,
      (w) => w / 2,
    ]),
    ...unwrapParameter(rowConstraints, containerWidth),
    ...resolveCommonProps(containerWidth, rest),
  };
}

export default function RowsPhotoAlbum<TPhoto extends Photo>({
  photos,
  onClick,
  sizes,
  breakpoints,
  defaultContainerWidth,
  ...rest
}: RowsPhotoAlbumProps<TPhoto>) {
  const { containerRef, containerWidth } = useContainerWidth(breakpoints, defaultContainerWidth);

  const { spacing, padding, componentsProps, render, targetRowHeight, minPhotos, maxPhotos, singleRowMaxHeight } =
    resolveProps(containerWidth, rest);

  const model = useMemo(
    () =>
      containerWidth !== undefined && spacing !== undefined && padding !== undefined && targetRowHeight !== undefined
        ? computeRowsLayout(photos, spacing, padding, containerWidth, targetRowHeight, minPhotos, maxPhotos)
        : undefined,
    [photos, spacing, padding, containerWidth, targetRowHeight, minPhotos, maxPhotos],
  );

  if (singleRowMaxHeight !== undefined && spacing !== undefined && padding !== undefined) {
    const maxWidth = Math.floor(
      photos.reduce(
        (acc, { width, height }) => acc + (width / height) * singleRowMaxHeight - 2 * padding,
        padding * photos.length * 2 + spacing * (photos.length - 1),
      ),
    );

    if (maxWidth > 0) {
      componentsProps.container = { ...componentsProps.container };
      componentsProps.container.style = { maxWidth, ...componentsProps.container.style };
    }
  }

  return <StaticPhotoAlbum layout="rows" ref={containerRef} {...{ model, componentsProps, render, onClick, sizes }} />;
}
