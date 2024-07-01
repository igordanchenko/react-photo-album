import { useMemo } from "react";

import { useContainerWidth } from "../hooks";
import StaticPhotoAlbum from "../../core/static";
import resolveMasonryProps from "./resolveMasonryProps";
import computeMasonryLayout from "../../layouts/masonry";
import { MasonryPhotoAlbumProps, Photo } from "../../types";

export default function MasonryPhotoAlbum<TPhoto extends Photo>({
  photos,
  breakpoints,
  defaultContainerWidth,
  ...rest
}: MasonryPhotoAlbumProps<TPhoto>) {
  const { containerRef, containerWidth } = useContainerWidth(breakpoints, defaultContainerWidth);

  const { spacing, padding, columns, ...restProps } = resolveMasonryProps(containerWidth, { photos, ...rest });

  const model = useMemo(
    () =>
      containerWidth !== undefined && spacing !== undefined && padding !== undefined && columns !== undefined
        ? computeMasonryLayout(photos, spacing, padding, containerWidth, columns)
        : undefined,
    [photos, spacing, padding, containerWidth, columns],
  );

  return <StaticPhotoAlbum layout="masonry" ref={containerRef} model={model} {...restProps} />;
}
