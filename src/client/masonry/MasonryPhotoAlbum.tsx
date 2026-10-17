import { forwardRef, useMemo } from "react";

import computeMasonryLayout from "../../layouts/masonry";
import StaticPhotoAlbum from "../../static";
import type { ElementRef, ForwardedRef, JSXElement, MasonryPhotoAlbumProps, Photo } from "../../types";
import { useContainerWidth } from "../hooks";
import resolveMasonryProps from "./resolveMasonryProps";

function MasonryPhotoAlbum<TPhoto extends Photo>(
  { photos, breakpoints, defaultContainerWidth, ...rest }: MasonryPhotoAlbumProps<TPhoto>,
  ref: ForwardedRef,
) {
  const { containerRef, containerWidth } = useContainerWidth(ref, breakpoints, defaultContainerWidth);

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

export default forwardRef(MasonryPhotoAlbum) as <TPhoto extends Photo>(
  props: MasonryPhotoAlbumProps<TPhoto> & ElementRef,
) => JSXElement;
