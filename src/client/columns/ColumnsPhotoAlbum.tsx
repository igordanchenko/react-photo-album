import { useMemo } from "react";

import { useContainerWidth } from "../hooks";
import StaticPhotoAlbum from "../../core/static";
import resolveColumnsProps from "./resolveColumnsProps";
import computeColumnsLayout from "../../layouts/columns";
import { ColumnsPhotoAlbumProps, Photo } from "../../types";

export default function ColumnsPhotoAlbum<TPhoto extends Photo>({
  photos,
  breakpoints,
  defaultContainerWidth,
  ...rest
}: ColumnsPhotoAlbumProps<TPhoto>) {
  const { containerRef, containerWidth } = useContainerWidth(breakpoints, defaultContainerWidth);

  const { spacing, padding, columns, ...restProps } = resolveColumnsProps(containerWidth, { photos, ...rest });

  const model = useMemo(
    () =>
      containerWidth !== undefined && spacing !== undefined && padding !== undefined && columns !== undefined
        ? computeColumnsLayout(photos, spacing, padding, containerWidth, columns)
        : undefined,
    [photos, spacing, padding, containerWidth, columns],
  );

  return <StaticPhotoAlbum layout="columns" ref={containerRef} model={model} {...restProps} />;
}
