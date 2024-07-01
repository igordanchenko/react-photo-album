import { useMemo } from "react";

import { useContainerWidth } from "../hooks";
import StaticPhotoAlbum from "../../core/static";
import resolveRowsProps from "./resolveRowsProps";
import computeRowsLayout from "../../layouts/rows";
import { Photo, RowsPhotoAlbumProps } from "../../types";

export default function RowsPhotoAlbum<TPhoto extends Photo>({
  photos,
  breakpoints,
  defaultContainerWidth,
  ...rest
}: RowsPhotoAlbumProps<TPhoto>) {
  const { containerRef, containerWidth } = useContainerWidth(breakpoints, defaultContainerWidth);

  const { spacing, padding, targetRowHeight, minPhotos, maxPhotos, ...restProps } = resolveRowsProps(containerWidth, {
    photos,
    ...rest,
  });

  const model = useMemo(
    () =>
      containerWidth !== undefined && spacing !== undefined && padding !== undefined && targetRowHeight !== undefined
        ? computeRowsLayout(photos, spacing, padding, containerWidth, targetRowHeight, minPhotos, maxPhotos)
        : undefined,
    [photos, spacing, padding, containerWidth, targetRowHeight, minPhotos, maxPhotos],
  );

  return <StaticPhotoAlbum layout="rows" ref={containerRef} model={model} {...restProps} />;
}
