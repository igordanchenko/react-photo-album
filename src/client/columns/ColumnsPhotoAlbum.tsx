import { useMemo } from "react";

import { useContainerWidth } from "../hooks";
import StaticPhotoAlbum from "../../core/static";
import computeColumnsLayout from "../../layouts/columns";
import { resolveCommonProps, resolveResponsiveParameter } from "../../core/utils";
import { ColumnsPhotoAlbumProps, Photo } from "../../types";

function resolveProps<TPhoto extends Photo>(
  containerWidth: number | undefined,
  { columns, ...rest }: Pick<ColumnsPhotoAlbumProps<TPhoto>, "spacing" | "padding" | "componentsProps" | "columns">,
) {
  return {
    columns: resolveResponsiveParameter(columns, containerWidth, [5, 4, 3, 2], 1),
    ...resolveCommonProps(containerWidth, rest),
  };
}

export default function ColumnsPhotoAlbum<TPhoto extends Photo>({
  photos,
  onClick,
  sizes,
  breakpoints,
  defaultContainerWidth,
  skeleton,
  ...restProps
}: ColumnsPhotoAlbumProps<TPhoto>) {
  const { containerRef, containerWidth } = useContainerWidth(breakpoints, defaultContainerWidth);

  const { spacing, padding, componentsProps, render, columns } = resolveProps(containerWidth, restProps);

  const model = useMemo(
    () =>
      containerWidth !== undefined && spacing !== undefined && padding !== undefined && columns !== undefined
        ? computeColumnsLayout(photos, spacing, padding, containerWidth, columns)
        : undefined,
    [photos, spacing, padding, containerWidth, columns],
  );

  return (
    <StaticPhotoAlbum
      layout="columns"
      ref={containerRef}
      {...{ model, componentsProps, render, onClick, sizes, skeleton }}
    />
  );
}
