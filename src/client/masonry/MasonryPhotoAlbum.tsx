import { useMemo } from "react";

import { useContainerWidth } from "../hooks";
import StaticPhotoAlbum from "../../core/static";
import computeMasonryLayout from "../../layouts/masonry";
import { resolveCommonProps, resolveResponsiveParameter } from "../../core/utils";
import { MasonryPhotoAlbumProps, Photo } from "../../types";

function resolveProps<TPhoto extends Photo>(
  containerWidth: number | undefined,
  { columns, ...rest }: Pick<MasonryPhotoAlbumProps<TPhoto>, "spacing" | "padding" | "componentsProps" | "columns">,
) {
  return {
    columns: resolveResponsiveParameter(columns, containerWidth, [5, 4, 3, 2], 1),
    ...resolveCommonProps(containerWidth, rest),
  };
}

export default function MasonryPhotoAlbum<TPhoto extends Photo>({
  photos,
  onClick,
  sizes,
  breakpoints,
  defaultContainerWidth,
  ...restProps
}: MasonryPhotoAlbumProps<TPhoto>) {
  const { containerRef, containerWidth } = useContainerWidth(breakpoints, defaultContainerWidth);

  const { spacing, padding, componentsProps, render, columns } = resolveProps(containerWidth, restProps);

  const model = useMemo(
    () =>
      containerWidth !== undefined && spacing !== undefined && padding !== undefined && columns !== undefined
        ? computeMasonryLayout(photos, spacing, padding, containerWidth, columns)
        : undefined,
    [photos, spacing, padding, containerWidth, columns],
  );

  return (
    <StaticPhotoAlbum layout="masonry" ref={containerRef} {...{ model, componentsProps, render, onClick, sizes }} />
  );
}
